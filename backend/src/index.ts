import express from 'express';
import cors from 'cors';
import neo4j from 'neo4j-driver';

const app = express();
app.use(cors());
app.use(express.json());

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'secretpassword'
  )
);

app.get('/api/neighbors/:id', async (req, res) => {
  const session = driver.session();
  const nodeId = req.params.id;

  try {
    const result = await session.run(
      `
      MATCH (n {id: $nodeId})-[r]-(neighbor)
      RETURN n, r, neighbor
      `,
      { nodeId }
    );

    const nodes = new Map();
    const edges: any[] = [];

    result.records.forEach(record => {
      const source = record.get('n').properties;
      const target = record.get('neighbor').properties;
      const rel = record.get('r');

      nodes.set(source.id, { id: source.id, label: source.name, phase: source.phase });
      nodes.set(target.id, { id: target.id, label: target.name, phase: target.phase });

      edges.push({
        id: rel.identity.toString(),
        source: source.id,
        target: target.id,
        label: rel.type
      });
    });

    res.json({
      nodes: Array.from(nodes.values()),
      edges
    });
  } catch (error) {
    res.status(500).send(error);
  } finally {
    await session.close();
  }
});

app.listen(5000, () => console.log('Backend fut a 5000-es porton'));