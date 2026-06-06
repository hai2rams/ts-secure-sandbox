import 'dotenv/config';
import express from 'express';
import { AuditRequestSchema } from './domain/entities';
import { runSecureAuditWorkflow } from './agents/auditorAgent';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.post('/api/v1/audit', async (req, res) => {
  const tenantId = req.headers['x-tenant-id'];

  if (typeof tenantId !== 'string' || tenantId.trim() === '') {
    res.status(401).json({ error: 'Unauthorized', message: 'Missing x-tenant-id header' });
    return;
  }

  const validation = AuditRequestSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid audit request payload',
      details: validation.error.flatten(),
    });
    return;
  }

  const receipt = await runSecureAuditWorkflow(tenantId, validation.data);
  res.status(200).json(receipt);
});

app.listen(port, () => {
  console.log(`[Ingress] Gateway listening on port ${port}`);
});
