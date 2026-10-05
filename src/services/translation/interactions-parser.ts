/**
 * InteractionsParser: Parser for Google Gemini Interactions API & Antigravity Agent responses.
 * Follows SRP: Dedicated to extracting text and parsing status from polymorphous Interactions API payloads.
 */
export class InteractionsParser {
  /**
   * Robust text extractor handling all known Gemini & Interactions API schemas
   */
  public static extractText(data: any): string {
    if (!data || typeof data !== 'object') return '';

    // 1. Direct text fields at root
    if (typeof data.output_text === 'string' && data.output_text.trim()) {
      return data.output_text.trim();
    }
    if (typeof data.text === 'string' && data.text.trim()) {
      return data.text.trim();
    }

    // 2. data.interaction wrapper
    if (data.interaction && typeof data.interaction === 'object') {
      const interText = this.extractText(data.interaction);
      if (interText) return interText;
    }

    // 3. data.response wrapper (common in Interactions API)
    if (data.response && typeof data.response === 'object') {
      const respText = this.extractText(data.response);
      if (respText) return respText;
    }

    // 4. Gemini candidates array
    if (Array.isArray(data.candidates) && data.candidates.length > 0) {
      for (const cand of data.candidates) {
        if (Array.isArray(cand?.content?.parts)) {
          const joined = cand.content.parts
            .map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
            .filter(Boolean)
            .join('\n')
            .trim();
          if (joined) return joined;
        }
      }
    }

    // 5. Steps array (Interactions API timeline schema)
    if (Array.isArray(data.steps) && data.steps.length > 0) {
      for (let i = data.steps.length - 1; i >= 0; i--) {
        const step = data.steps[i];
        if (!step) continue;

        // Direct text property (e.g. { type: 'text', text: '...' })
        if (typeof step.text === 'string' && step.text.trim()) {
          return step.text.trim();
        }

        // Direct output_text property
        if (typeof step.output_text === 'string' && step.output_text.trim()) {
          return step.output_text.trim();
        }

        // Direct output property (string or recursive object)
        if (typeof step.output === 'string' && step.output.trim()) {
          return step.output.trim();
        }
        if (step.output && typeof step.output === 'object') {
          const outText = this.extractText(step.output);
          if (outText) return outText;
        }

        // Direct content property (string or recursive object)
        if (typeof step.content === 'string' && step.content.trim()) {
          return step.content.trim();
        }

        // Parts array in step.content
        if (Array.isArray(step.content?.parts)) {
          const partsText = step.content.parts
            .map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
            .filter(Boolean)
            .join('\n')
            .trim();
          if (partsText) return partsText;
        }

        // Parts array directly on step
        if (Array.isArray(step.parts)) {
          const partsText = step.parts
            .map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
            .filter(Boolean)
            .join('\n')
            .trim();
          if (partsText) return partsText;
        }

        // Message property on step
        if (step.message && typeof step.message === 'object') {
          const msgText = this.extractText(step.message);
          if (msgText) return msgText;
        }
      }
    }

    // 6. Outputs array (legacy schema)
    if (Array.isArray(data.outputs) && data.outputs.length > 0) {
      for (let i = data.outputs.length - 1; i >= 0; i--) {
        const out = data.outputs[i];
        if (!out) continue;
        if (typeof out.text === 'string' && out.text.trim()) return out.text.trim();
        if (typeof out.output_text === 'string' && out.output_text.trim()) return out.output_text.trim();
        if (typeof out === 'string' && out.trim()) return out.trim();
        if (typeof out === 'object') {
          const outText = this.extractText(out);
          if (outText) return outText;
        }
      }
    }

    // 7. Result property
    if (data.result) {
      if (typeof data.result === 'string' && data.result.trim()) return data.result.trim();
      if (typeof data.result === 'object') {
        const resText = this.extractText(data.result);
        if (resText) return resText;
      }
    }

    return '';
  }

  /**
   * Checks if interaction state indicates failure
   */
  public static checkFailure(data: any): { failed: boolean; message?: string } {
    if (!data || typeof data !== 'object') return { failed: false };
    const state = data.status || data.state;
    if (state === 'failed') {
      const errMsg = data.error?.message || data.failure_reason || JSON.stringify(data.error || 'Server error');
      return { failed: true, message: String(errMsg) };
    }
    return { failed: false };
  }

  /**
   * Checks if interaction is running asynchronously and needs polling
   */
  public static checkInProgress(data: any): { inProgress: boolean; resourceId?: string } {
    if (!data || typeof data !== 'object') return { inProgress: false };
    const state = data.status || data.state;
    if (state === 'in_progress' || state === 'running' || state === 'queued') {
      const id = data.name || data.id || data.interaction_id;
      return { inProgress: true, resourceId: id ? String(id) : undefined };
    }
    return { inProgress: false };
  }
}
