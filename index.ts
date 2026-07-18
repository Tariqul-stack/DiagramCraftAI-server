import 'dotenv/config';

import app from './src/app';
import connectDB from './src/config/db';

connectDB().catch(console.error);
const PORT = process.env.PORT || 8000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
