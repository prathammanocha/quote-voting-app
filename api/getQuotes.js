mport { google } from 'googleapis';

export default async function handler(req, res) {
  console.log('API route called');
  try {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS is not set');
    }

    let credentials;
    try {
      // Parse the credentials, replacing newline placeholders with actual newlines
      credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS.replace(/\\n/g, '\n'));
      console.log('Credentials parsed successfully');
    } catch (parseError) {
      console.error('Error parsing credentials:', parseError);
      throw new Error(`Failed to parse GOOGLE_APPLICATION_CREDENTIALS: ${parseError.message}`);
    }

    if (!process.env.SPREADSHEET_ID) {
      throw new Error('SPREADSHEET_ID is not set');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    console.log('Auth created');

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('Sheets client created');

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'A2:A', // Assuming quotes start from A2
    });

    console.log('Sheets response received');

    const quotes = response.data.values.map((row, index) => ({
      id: index + 1,
      text: row[0],
      votes: 0,
      totalVotes: 0,
    }));

    console.log('Quotes processed:', quotes.length);

    res.status(200).json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Failed to fetch quotes', details: error.message });
  }
}