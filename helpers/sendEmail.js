import sgMail from "@sendgrid/mail";

const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async (data) => {
  const email = { ...data, from: "bakynbard@gmail.com" };
  await sgMail
    .send(email)
    .then(() => {
      console.log("email send");
    })
    .catch((error) => console.log(error.message));
};
