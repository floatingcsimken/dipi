import { useState, useEffect } from 'react';
import { ReactFlow, Controls, Background, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const fetchNeighbors = async (nodeId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/neighbors/${nodeId}`);
      const data = await res.json();

      const formattedNodes: Node[] = data.nodes.map((n: any, index: number) => ({
        id: n.id,
        data: { label: `${n.label} (${n.phase || 'N/A'})` },
        position: { x: (index % 3) * 200 + 100, y: Math.floor(index / 3) * 120 + 100 },
        style: {
          background: n.phase === 'Observe' ? '#e1f5fe' : '#fff3e0',
          borderRadius: '8px',
          border: '2px solid #333',
          padding: '10px'
        }
      }));

      const formattedEdges: Edge[] = data.edges.map((e: any) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: true
      }));

      setNodes(formattedNodes);
      setEdges(formattedEdges);
    } catch (err) {
      console.error('Hiba az adatok lekérésekor:', err);
    }
  };

  useEffect(() => {
    fetchNeighbors('target-01');
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}