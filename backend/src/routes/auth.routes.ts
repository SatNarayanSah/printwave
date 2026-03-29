import { Router } from 'express';
import { register, login, logout, verifyEmail, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/verify-email', verifyEmail);
router.get('/me', authenticate, getMe);

// Dev-only: Test SMTP connection
if (process.env.NODE_ENV !== 'production') {
  router.get('/test-email', async (req, res) => {
    const nodemailer = await import('nodemailer');
    const to = (req.query.to as string) || process.env.SMTP_USER;
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false },
    });
    try {
      await transporter.verify();
      await transporter.sendMail({
        from: `"PrintWave Test" <${process.env.SMTP_USER}>`,
        to,
        subject: 'PrintWave SMTP Test ✓',
        html: '<h2>SMTP is working correctly!</h2><p>If you receive this, your email configuration is valid.</p>',
      });
      res.json({ ok: true, message: `Test email sent to ${to}` });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  router.get('/make-me-admin', authenticate, async (req: any, res) => {
    try {
      const { AppDataSource } = await import('../config/data-source.js');
      const { User } = await import('../entities/User.js');
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ id: req.user.id });
      if(user) {
        user.role = 'ADMIN' as any;
        await userRepo.save(user);
        res.json({ ok: true, message: 'You are now an Admin! Please sign in again.' });
      }
    } catch(err: any){
      res.status(500).json({ ok: false, error: err.message });
    }
  });
}

export default router;

