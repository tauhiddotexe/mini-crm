import time
import logging
from parser import parse_email_body
from mailbox import connect_mailbox, fetch_unprocessed, mark_processed
from client import create_ticket

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

POLL_INTERVAL = 60


def process_emails():
    try:
        mail = connect_mailbox()
        logger.info("Connected to mailbox")

        while True:
            emails = fetch_unprocessed(mail)
            logger.info(f"Found {len(emails)} unprocessed emails")

            for email_data in emails:
                parsed = parse_email_body(email_data["body"])
                if not parsed:
                    logger.warning(f"Failed to parse email: {email_data['message_id']}")
                    mark_processed(mail, email_data["message_id"])
                    continue

                ticket_data = {
                    "customer_name": parsed["customer_name"],
                    "customer_email": parsed["customer_email"],
                    "subject": email_data["subject"],
                    "description": parsed["description"],
                }

                result = create_ticket(ticket_data)
                if result:
                    logger.info(f"Created ticket: {result['ticket_id']}")
                    mark_processed(mail, email_data["message_id"])
                else:
                    logger.error(f"Failed to create ticket for email: {email_data['message_id']}")

            time.sleep(POLL_INTERVAL)

    except Exception as e:
        logger.error(f"Worker error: {e}")


if __name__ == "__main__":
    process_emails()
