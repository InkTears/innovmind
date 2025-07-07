// This file has been deprecated in favor of NextAuth.js
// See [...nextauth].js for the current authentication implementation



export default function handler(req, res) {
    return res.status(410).json({ 
        error: 'This API endpoint has been deprecated. Please use NextAuth.js for authentication.' 
    });
}
