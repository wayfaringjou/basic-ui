class OptionNode {
  element: HTMLLIElement;
  nextNodeId: string | undefined;
  prevNodeId: string | undefined;
  constructor(element: HTMLLIElement) {
    this.element = element;
    this.nextNodeId = undefined;
    this.prevNodeId = undefined;
  }
}

// TODO: make this cleaner and a hook
export class OptionLinkedList {
  firstId: string | undefined;
  lastId: string | undefined;
  map: Map<string, OptionNode>;
  constructor() {
    this.firstId = undefined;
    this.lastId = undefined;
    this.map = new Map();
  }
  get(id: string) {
    return this.map.get(id);
  }
  set(element: HTMLLIElement) {
    const newNode = new OptionNode(element);
    // No nodes stored yet
    if (this.lastId === undefined) {
      this.firstId = element.id;
      this.lastId = element.id;
      this.map.set(element.id, newNode);
    } else {
      // There are nodes stored
      const lastNode = this.map.get(this.lastId);
      if (!lastNode) throw new Error("Unexpected: last node id not found");

      const updatedNode = new OptionNode(lastNode.element);
      updatedNode.prevNodeId = lastNode.prevNodeId;
      updatedNode.nextNodeId = element.id;
      this.map.set(updatedNode.element.id, updatedNode);

      newNode.prevNodeId = updatedNode.element.id;
      this.map.set(element.id, newNode);
      this.lastId = element.id;
    }
  }
  delete(id: string) {
    // If this is the last, it can be the only one
    if (id === this.lastId) {
      const lastNode = this.map.get(id);
      if (!lastNode) throw new Error("Unexpected: last node id not found");
      // Check if there are more nodes remaining
      if (lastNode.prevNodeId) {
        const newLastNode = this.map.get(lastNode.prevNodeId);
        if (!newLastNode)
          throw new Error("Unexpected: next to last node id not found");

        const updatedNode = new OptionNode(newLastNode.element);
        updatedNode.prevNodeId = newLastNode.prevNodeId;

        this.map.set(updatedNode.element.id, updatedNode);
        this.lastId = updatedNode.element.id;
      } else {
        // If this is the last and there weren't previous nodes, asume this is the last
        this.firstId = undefined;
        this.lastId = undefined;
      }
      this.map.delete(id);
    } else {
      // If this is not the last, it can still be the first one
      const linkedNode = this.map.get(id);
      if (!linkedNode) throw new Error("Unexpected: linked node id not found");
      // If there are previous, this is not the first
      if (linkedNode.prevNodeId) {
        const previousLinkedNode = this.map.get(linkedNode.prevNodeId);
        if (!previousLinkedNode)
          throw new Error("Unexpected: previous linked node id not found");

        const updatedNode = new OptionNode(previousLinkedNode.element);

        updatedNode.nextNodeId = linkedNode.nextNodeId;
        updatedNode.prevNodeId = previousLinkedNode.prevNodeId;
        this.map.set(updatedNode.element.id, updatedNode);
      }
      // This can be the first node
      if (linkedNode.nextNodeId) {
        const nextLinkedNode = this.map.get(linkedNode.nextNodeId);
        if (!nextLinkedNode)
          throw new Error("Unexpected: next linked node id not found");

        const updatedNode = new OptionNode(nextLinkedNode.element);
        updatedNode.prevNodeId = linkedNode.prevNodeId;
        updatedNode.nextNodeId = nextLinkedNode.nextNodeId;
        this.map.set(updatedNode.element.id, updatedNode);
        // Update firstId if deleted node was first
        if (linkedNode.element.id === this.firstId)
          this.firstId = updatedNode.element.id;
      }
      this.map.delete(id);
    }
  }
  size() {
    return this.map.size;
  }
  prev(id: string) {
    const { prevNodeId } = this.map.get(id) ?? {};
    if (prevNodeId === undefined) return;

    return this.map.get(prevNodeId);
  }
  next(id: string) {
    const { nextNodeId } = this.map.get(id) ?? {};
    if (nextNodeId === undefined) return;

    return this.map.get(nextNodeId);
  }
  first() {
    if (this.firstId === undefined) return;
    return this.map.get(this.firstId);
  }
  last() {
    if (this.lastId === undefined) return;
    return this.map.get(this.lastId);
  }
}
