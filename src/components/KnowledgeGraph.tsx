import { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { BLOG_PATH, API_PATH } from '../utils/base';

interface GraphNode {
  id: string;
  name: string;
  status: 'seed' | 'growing' | 'evergreen';
  tags: string[];
  val?: number;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type?: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const statusColors = {
  seed: '#22c55e',
  growing: '#3b82f6',
  evergreen: '#eab308',
};

const Legend = () => (
  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg p-4 text-white">
    <h3 className="text-sm font-bold mb-2">图例</h3>
    <div className="space-y-2 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span>🌱 萌芽</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <span>🌿 生长中</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <span>🌳 常青</span>
      </div>
      <div className="mt-2 pt-2 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-purple-500/50"></div>
          <span>双向链接</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-6 h-0.5 bg-gray-500/50"></div>
          <span>共享标签</span>
        </div>
      </div>
    </div>
  </div>
);

const KnowledgeGraph = () => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fgRef = useRef<any>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_PATH}/graph-data`)
      .then((res) => res.json())
      .then((data) => {
        const linkCount: Record<string, number> = {};
        data.links.forEach((link: GraphLink) => {
          const sourceId = typeof link.source === 'string' ? link.source : (link.source as GraphNode).id;
          const targetId = typeof link.target === 'string' ? link.target : (link.target as GraphNode).id;
          linkCount[sourceId] = (linkCount[sourceId] || 0) + 1;
          linkCount[targetId] = (linkCount[targetId] || 0) + 1;
        });

        const nodesWithVal = data.nodes.map((node: GraphNode) => ({
          ...node,
          val: Math.pow(Math.max(linkCount[node.id] || 0, 1), 2) * 8,
        }));

        setGraphData({ nodes: nodesWithVal, links: data.links });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load graph data:', err);
        setError('加载失败');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 0) {
      fgRef.current.d3Force('charge').strength(-400);
    }
  }, [graphData.nodes.length]);

  const handleNodeClick = (node: GraphNode) => {
    window.location.href = `${BLOG_PATH}/${node.id}`;
  };

  const nodeColor = (node: GraphNode) => {
    if (hoveredNode) {
      const isConnected =
        graphData.links.some((link) => {
          const sourceId = typeof link.source === 'string' ? link.source : (link.source as GraphNode).id;
          const targetId = typeof link.target === 'string' ? link.target : (link.target as GraphNode).id;
          return (
            (sourceId === hoveredNode && targetId === node.id) ||
            (targetId === hoveredNode && sourceId === node.id)
          );
        }) || node.id === hoveredNode;

      return isConnected ? statusColors[node.status] : '#333';
    }
    return statusColors[node.status];
  };

  const linkColor = (link: GraphLink) => {
    if (hoveredNode) {
      const sourceId = typeof link.source === 'string' ? link.source : (link.source as GraphNode).id;
      const targetId = typeof link.target === 'string' ? link.target : (link.target as GraphNode).id;
      const isConnected = sourceId === hoveredNode || targetId === hoveredNode;
      return isConnected ? (link.type === 'tag' ? 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.9)') : 'rgba(255,255,255,0.2)';
    }
    return link.type === 'tag' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.7)';
  };

  const linkWidth = (link: GraphLink) => {
    if (hoveredNode) {
      const sourceId = typeof link.source === 'string' ? link.source : (link.source as GraphNode).id;
      const targetId = typeof link.target === 'string' ? link.target : (link.target as GraphNode).id;
      return sourceId === hoveredNode || targetId === hoveredNode ? 3 : 1;
    }
    return link.type === 'tag' ? 2 : 2.5;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p>正在加载知识图谱...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400">
        <p>加载失败: {error}</p>
      </div>
    );
  }

  if (graphData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p>暂无数据</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeColor={nodeColor}
        nodeLabel={(node: GraphNode) => node.name}
        nodeRelSize={4}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleColor={() => 'rgba(139, 92, 246, 0.6)'}
        onNodeClick={handleNodeClick}
        onNodeHover={(node: GraphNode | null) => setHoveredNode(node?.id || null)}
        backgroundColor="#0f172a"
        nodeCanvasObject={(node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const label = node.name;
          const fontSize = Math.max(12 / globalScale, 2);
          ctx.font = `${fontSize}px sans-serif`;
          const textWidth = (ctx.measureText(label) as TextMetrics).width;
          const bckgWidth = textWidth + fontSize;
          const bckgHeight = fontSize + fontSize;

          ctx.fillStyle = nodeColor(node);
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, (node.val || 5) / 2, 0, 2 * Math.PI, false);
          ctx.fill();

          ctx.fillStyle = 'rgba(0,0,0,0.8)';
          ctx.fillRect(
            node.x! - bckgWidth / 2,
            node.y! - bckgHeight / 2 + 4,
            bckgWidth,
            bckgHeight
          );

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(label, node.x!, node.y! + 4);
        }}
        nodeCanvasObjectMode={() => 'after'}
      />
      <Legend />
      <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-3 py-2 rounded">
        节点数: {graphData.nodes.length} | 链接数: {graphData.links.length}
      </div>
    </div>
  );
};

export default KnowledgeGraph;