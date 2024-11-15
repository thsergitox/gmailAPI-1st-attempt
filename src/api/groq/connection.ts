import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY, 
});

const PROMPT = '"Determine whether the following email is spam, phishing, or illegitimate. If it is, respond only with 1. If it is not spam, respond only with 0. Do not include any explanations or additional text. Note: We are an association of computer science students and are not interested in purchasing any products or services, neither affiliate into a company."'

export const verifySpamWithAI = async (emailsInfo: Array<{id: string, body: string, spam?: boolean}>) => {
  let models = ['llama-3.1-8b-instant', 'llama-3.1-70b-versatile'];

  const promises = emailsInfo.map(async (emailInfo) => {
    console.log(`length: ${emailInfo.body.length}`);
    let chatCompletion;
    let success = false

    //console.log('Processing email:', [...models]);

    for (const model of [...models]) { // Use a copy of the models array
      try {
        chatCompletion = await client.chat.completions.create({
          messages: [
            { role: 'system', content: PROMPT },
            { role: 'user', content: `Email: ${emailInfo.body}` },
          ],
          model: model,
        });
        success = true;
        break;
      } catch (error) {
        models = models.filter(m => m !== model); // Remove the failed model
        console.error(`Error with ${model} model:`, (error as any).message);
      }
    }

    if (!success) {
      throw new Error('All models failed');
    }

    if (chatCompletion && chatCompletion.choices[0].message.content === '1') {
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
