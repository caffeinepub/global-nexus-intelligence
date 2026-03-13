import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState } from "react";
import { Variant_country_institution_corporation } from "../backend.d";
import { useInfluenceEdges } from "../hooks/useQueries";

type GraphNode = {
  id: string;
  type: Variant_country_institution_corporation;
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number;
};

function nodeColorHex(type: Variant_country_institution_corporation): string {
  switch (type) {
    case Variant_country_institution_corporation.country:
      return "#22d3ee";
    case Variant_country_institution_corporation.corporation:
      return "#f59e0b";
    case Variant_country_institution_corporation.institution:
      return "#a78bfa";
    default:
      return "#4ade80";
  }
}

export function InfluenceMap() {
  const { data: edges, isLoading } = useInfluenceEdges();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<GraphNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!edges || edges.length === 0 || !canvasRef.current) return;

    // Local ref to satisfy TS narrowing inside nested functions
    const edgeList = edges;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const nodeMap = new Map<string, GraphNode>();
    const connCount = new Map<string, number>();

    for (const e of edgeList) {
      for (const id of [e.sourceEntity, e.targetEntity]) {
        if (!nodeMap.has(id)) {
          nodeMap.set(id, {
            id,
            type: e.entityType,
            x: Math.random() * W,
            y: Math.random() * H,
            vx: 0,
            vy: 0,
            connections: 0,
          });
        }
        connCount.set(id, (connCount.get(id) ?? 0) + 1);
      }
    }
    for (const [id, count] of connCount) {
      const n = nodeMap.get(id);
      if (n) n.connections = count;
    }

    const nodes = Array.from(nodeMap.values());
    nodesRef.current = nodes;

    function simulate() {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
          const force = 800 / (dist * dist);
          a.vx += (dx / dist) * force;
          a.vy += (dy / dist) * force;
          b.vx -= (dx / dist) * force;
          b.vy -= (dy / dist) * force;
        }
      }
      for (const e of edgeList) {
        const a = nodeMap.get(e.sourceEntity);
        const b = nodeMap.get(e.targetEntity);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
        const targetDist = 120;
        const force = ((dist - targetDist) / dist) * 0.05 * e.strength;
        a.vx += dx * force;
        a.vy += dy * force;
        b.vx -= dx * force;
        b.vy -= dy * force;
      }
      for (const n of nodes) {
        n.vx += (W / 2 - n.x) * 0.002;
        n.vy += (H / 2 - n.y) * 0.002;
        n.vx *= 0.85;
        n.vy *= 0.85;
        n.x = Math.max(30, Math.min(W - 30, n.x + n.vx));
        n.y = Math.max(30, Math.min(H - 30, n.y + n.vy));
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      for (const e of edgeList) {
        const a = nodeMap.get(e.sourceEntity);
        const b = nodeMap.get(e.targetEntity);
        if (!a || !b) continue;

        const isSelected =
          selectedNode === e.sourceEntity || selectedNode === e.targetEntity;
        ctx!.globalAlpha = isSelected ? 0.8 : 0.25;
        ctx!.strokeStyle = nodeColorHex(e.entityType);
        ctx!.lineWidth = e.strength * 2;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
      }

      for (const n of nodes) {
        const r = 5 + n.connections * 2;
        const color = nodeColorHex(n.type);
        const isSelected = selectedNode === n.id;

        ctx!.globalAlpha = isSelected || !selectedNode ? 1 : 0.4;

        if (isSelected) {
          ctx!.shadowColor = color;
          ctx!.shadowBlur = 16;
        }

        ctx!.fillStyle = color;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.shadowBlur = 0;

        ctx!.globalAlpha = isSelected || !selectedNode ? 0.9 : 0.2;
        ctx!.fillStyle = "#e2e8f0";
        ctx!.font = "10px 'JetBrains Mono', monospace";
        const label = n.id.length > 14 ? `${n.id.slice(0, 14)}\u2026` : n.id;
        ctx!.fillText(label, n.x + r + 3, n.y + 4);
      }

      ctx!.globalAlpha = 1;
    }

    let frameCount = 0;
    function loop() {
      if (frameCount < 200) {
        simulate();
        frameCount++;
      }
      draw();
      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animRef.current);
  }, [edges, selectedNode]);

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    let clicked: string | null = null;
    for (const n of nodesRef.current) {
      const r = 5 + n.connections * 2;
      const dx = cx - n.x;
      const dy = cy - n.y;
      if (Math.sqrt(dx * dx + dy * dy) <= r + 4) {
        clicked = n.id;
      }
    }
    setSelectedNode(clicked === selectedNode ? null : clicked);
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            INFLUENCE MAP
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            GLOBAL INFLUENCE NETWORK \u00b7 FORCE-DIRECTED GRAPH
          </p>
        </div>
        {selectedNode && (
          <div className="text-xs font-mono px-3 py-1.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            SELECTED: {selectedNode}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {[
          {
            label: "COUNTRY",
            color: "#22d3ee",
          },
          {
            label: "CORPORATION",
            color: "#f59e0b",
          },
          {
            label: "INSTITUTION",
            color: "#a78bfa",
          },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: item.color }}
            />
            <span className="text-[10px] font-mono text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
        <div className="text-[10px] font-mono text-muted-foreground ml-auto">
          Click node to highlight connections
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-[600px]" />
      ) : (
        <div
          data-ocid="influence.canvas_target"
          className="terminal-card rounded overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            width={1200}
            height={600}
            className="w-full cursor-crosshair"
            style={{ background: "oklch(0.08 0.012 255)" }}
            onClick={handleCanvasClick}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSelectedNode(null);
            }}
            tabIndex={0}
            role="img"
            aria-label="Influence network graph - click nodes to highlight connections"
          />
        </div>
      )}
    </div>
  );
}
