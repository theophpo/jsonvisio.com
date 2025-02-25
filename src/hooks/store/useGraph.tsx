import create from "zustand";
import { EdgeData, NodeData } from "reaflow/dist/types";
import { Graph } from "src/components/Graph";
import { getChildrenEdges } from "src/utils/getChildrenEdges";
import { getOutgoers } from "src/utils/getOutgoers";

export interface Graph {
  nodes: NodeData[];
  edges: EdgeData[];
  collapsedNodes: string[];
  collapsedEdges: string[];
}

interface GraphActions {
  setGraphValue: (key: keyof Graph, value: any) => void;
  expandNodes: (nodeId: string) => void;
  collapseNodes: (nodeId: string) => void;
}

const initialStates: Graph = {
  nodes: [],
  edges: [],
  collapsedNodes: [],
  collapsedEdges: [],
};

const useGraph = create<Graph & GraphActions>((set) => ({
  ...initialStates,
  setGraphValue: (key, value) =>
    set({
      collapsedNodes: [],
      collapsedEdges: [],
      [key]: value,
    }),
  expandNodes: (nodeId) =>
    set((state) => {
      const childrenNodes = getOutgoers(nodeId, state.nodes, state.edges);
      const childrenEdges = getChildrenEdges(childrenNodes, state.edges);

      const nodeIds = childrenNodes.map((node) => node.id);
      const edgeIds = childrenEdges.map((edge) => edge.id);

      return {
        ...state,
        collapsedNodes: state.collapsedNodes.filter(
          (nodeId) => !nodeIds.includes(nodeId)
        ),
        collapsedEdges: state.collapsedEdges.filter(
          (edgeId) => !edgeIds.includes(edgeId)
        ),
      };
    }),
  collapseNodes: (nodeId) =>
    set((state) => {
      const childrenNodes = getOutgoers(nodeId, state.nodes, state.edges);
      const childrenEdges = getChildrenEdges(childrenNodes, state.edges);

      const nodeIds = childrenNodes.map((node) => node.id);
      const edgeIds = childrenEdges.map((edge) => edge.id);

      return {
        ...state,
        collapsedNodes: state.collapsedNodes.concat(nodeIds),
        collapsedEdges: state.collapsedEdges.concat(edgeIds),
      };
    }),
}));

export default useGraph;
