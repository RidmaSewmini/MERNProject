import { VERIFICATION_EMAIL_TEMPLATE,
	     PASSWORD_RESET_REQUEST_TEMPLATE, 
		 PASSWORD_RESET_SUCCESS_TEMPLATE,
		} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        });

        console.log("Email sent successfully", response);
    }catch (error){
        console.error(`Error sending verification`,error);

        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const sendWelcomeEmail = async (email, firstName) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,

      template_uuid: "08fd7c2a-9aa3-4ecd-bc13-282b197c12b7",


      template_variables: {
        company_info_name: "TechSphere Lanka",
        firstName,   // ✅ matches {{firstName}}
      },
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};


export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});
	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};

/* =========================
   Generic Email Function
   =========================
   For bidding notifications / other custom emails
*/

export const sendEmail = async ({ email, subject, text, html }) => {
    if (!email) throw new Error("No recipients defined");

    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject,
            text,
            html, // optional, you can send either text or html
        });

        console.log(`Email sent successfully to ${email}`, response);
    } catch (error) {
        console.error(`Error sending email to ${email}`, error);
        throw new Error(`Error sending email: ${error}`);
    }
};