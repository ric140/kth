import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { GmailEmailMessage } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Configure Google Auth Provider with requested Gmail scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleProvider.setCustomParameters({
  prompt: 'consent'
});

// IN-MEMORY access token storage (Security constraint: NEVER in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
let tokenListeners: ((token: string | null) => void)[] = [];

export const subscribeToTokenChanges = (listener: (token: string | null) => void) => {
  tokenListeners.push(listener);
  listener(cachedAccessToken);
  return () => {
    tokenListeners = tokenListeners.filter(l => l !== listener);
  };
};

const notifyTokenListeners = (token: string | null) => {
  cachedAccessToken = token;
  tokenListeners.forEach(listener => {
    try {
      listener(token);
    } catch (e) {
      console.error('Error notifying token listener', e);
    }
  });
};

export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};

// Listen to Firebase Auth state
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    notifyTokenListeners(null);
  }
});

// Trigger Google Sign-In with Gmail permissions
export const connectGoogleGmail = async (): Promise<{ user: FirebaseUser; accessToken: string }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No access token returned from Google Auth');
    }
    const token = credential.accessToken;
    notifyTokenListeners(token);
    return { user: result.user, accessToken: token };
  } catch (err) {
    console.error('Failed to sign in with Google / Gmail:', err);
    throw err;
  }
};

export const disconnectGmail = async () => {
  try {
    await signOut(auth);
  } finally {
    notifyTokenListeners(null);
  }
};

// Helper to encode string to RFC 4648 Base64URL
const toBase64Url = (str: string): string => {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
  senderName?: string;
  partnerName?: string;
}

/**
 * Send an email directly via the Gmail API on behalf of the authenticated user
 */
export const sendGmail = async (payload: SendEmailPayload): Promise<{ success: boolean; id?: string; error?: string }> => {
  const token = cachedAccessToken;
  if (!token) {
    return { success: false, error: 'Gmail is not connected. Please connect your Gmail account.' };
  }

  try {
    const currentUser = auth.currentUser;
    const fromAddress = currentUser?.email || 'me';

    const rfc822Message = [
      `From: ${currentUser?.displayName ? `"${currentUser.displayName}" <${fromAddress}>` : fromAddress}`,
      `To: ${payload.to}`,
      `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(payload.subject)))}?=`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #004D40; color: #ffffff; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px;">Kampot Tech Hub</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #80CBC4;">Direct Service Inquiry & Booking Request</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <p style="font-size: 16px; margin-top: 0;">Hello <strong>${payload.partnerName || 'Service Provider'}</strong>,</p>
          <div style="background-color: #f7fafc; border-left: 4px solid #004D40; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; white-space: pre-wrap; font-size: 15px;">${payload.body}</p>
          </div>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; font-size: 13px; color: #666;">
            <p style="margin: 4px 0;"><strong>Customer:</strong> ${currentUser?.displayName || 'Client'} (${fromAddress})</p>
            <p style="margin: 4px 0;"><strong>Sent via:</strong> Kampot Tech Hub Online Portal</p>
            <p style="margin: 4px 0;"><strong>Location:</strong> Kampot, Cambodia</p>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 12px; text-align: center; font-size: 12px; color: #64748b;">
          This message was sent using the Gmail API integration on Kampot Tech Hub. You can reply directly to this email.
        </div>
      </div>`
    ].join('\r\n');

    const raw = toBase64Url(rfc822Message);

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gmail API send error:', errorData);
      return { success: false, error: errorData.error?.message || 'Failed to send email via Gmail' };
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('Error sending message via Gmail API:', err);
    return { success: false, error: err.message || 'Network error while contacting Gmail API' };
  }
};

/**
 * Fetch recent sent and received messages to display communication history
 */
export const fetchRecentGmailMessages = async (query = 'Kampot Tech Hub'): Promise<GmailEmailMessage[]> => {
  const token = cachedAccessToken;
  if (!token) return [];

  try {
    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (!listRes.ok) return [];

    const listData = await listRes.json();
    const messages = listData.messages || [];

    const detailedList = await Promise.all(
      messages.slice(0, 8).map(async (msg: { id: string; threadId: string }) => {
        try {
          const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          if (!detailRes.ok) return null;
          const detail = await detailRes.json();
          const headers = detail.payload?.headers || [];
          const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
          const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || '';
          const to = headers.find((h: any) => h.name.toLowerCase() === 'to')?.value || '';
          const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

          return {
            id: detail.id,
            threadId: detail.threadId,
            snippet: detail.snippet || '',
            subject,
            from,
            to,
            date,
          } as GmailEmailMessage;
        } catch {
          return null;
        }
      })
    );

    return detailedList.filter((m): m is GmailEmailMessage => m !== null);
  } catch (e) {
    console.error('Failed to fetch Gmail messages:', e);
    return [];
  }
};
