import imaplib
import email
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

IMAP_HOST = os.getenv("IMAP_HOST", "imap.gmail.com")
IMAP_PORT = int(os.getenv("IMAP_PORT", "993"))
IMAP_USER = os.getenv("IMAP_USER")
IMAP_PASSWORD = os.getenv("IMAP_PASSWORD")


def connect_mailbox() -> imaplib.IMAP4_SSL:
    mail = imaplib.IMAP4_SSL(IMAP_HOST, IMAP_PORT)
    mail.login(IMAP_USER, IMAP_PASSWORD)
    return mail


def fetch_unprocessed(mail: imaplib.IMAP4_SSL) -> list[dict]:
    mail.select("INBOX")
    status, messages = mail.search(None, "UNSEEN")
    if status != "OK":
        return []

    messages = messages[0].split()
    emails = []

    for msg_id in messages:
        status, data = mail.fetch(msg_id, "(RFC822)")
        if status == "OK":
            raw = data[0][1]
            msg = email.message_from_bytes(raw)
            emails.append({
                "message_id": msg_id.decode(),
                "subject": msg.get("Subject", ""),
                "from": msg.get("From", ""),
                "body": get_body(msg),
            })

    return emails


def get_body(msg) -> str:
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            if content_type == "text/plain":
                payload = part.get_payload(decode=True)
                if payload is None:
                    continue
                return payload.decode(errors="ignore")
    else:
        payload = msg.get_payload(decode=True)
        if payload is None:
            return ""
        return payload.decode(errors="ignore")
    return ""


def mark_processed(mail: imaplib.IMAP4_SSL, msg_id: str):
    mail.store(msg_id.encode(), "+FLAGS", "\\Seen")
