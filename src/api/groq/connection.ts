import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY, 
});

const PROMPT = '"Determine whether the following email is spam, phishing, or illegitimate. If it is, respond only with 1. If it is not spam, respond only with 0. Do not include any explanations or additional text. Note: We are an association of computer science students and are not interested in purchasing any products or services."'

export const verifySpamWithAI = async (emailsInfo: Array<{id: string, body: string, spam?: boolean}>) => {
  const promises = emailsInfo.map(async (emailInfo) => {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: 'system', content:  PROMPT},
        { role: 'user', content: `Email: ${emailInfo.body}` },
      ],
      model: 'llama3-8b-8192',
    });

    if (chatCompletion.choices[0].message.content === '1') {
      console.log('Spam');
      emailInfo.spam = true;
    } else {
      emailInfo.spam = false;
      console.log('Not spam');
    }
  });

  await Promise.all(promises);
  return emailsInfo;
}
