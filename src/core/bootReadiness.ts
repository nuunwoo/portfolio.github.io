export type BootStepKey = string;

export type BootStepStatus = "idle" | "loading" | "ready" | "error";

export type BootStepDefinition = {
  key: BootStepKey;
  required?: boolean;
};

export type BootReadinessStep = {
  key: BootStepKey;
  required: boolean;
  status: BootStepStatus;
};

export type BootReadinessSnapshot = {
  progress: number;
  isReady: boolean;
  hasError: boolean;
  steps: BootReadinessStep[];
};

type Listener = (snapshot: BootReadinessSnapshot) => void;

class BootReadiness {
  private steps = new Map<BootStepKey, BootReadinessStep>();
  private listeners = new Set<Listener>();

  configure(stepDefinitions: BootStepDefinition[]) {
    this.steps = new Map(
      stepDefinitions.map(({ key, required = true }) => [
        key,
        { key, required, status: "idle" as BootStepStatus },
      ])
    );

    this.emit();
  }

  setStepStatus(key: BootStepKey, status: BootStepStatus) {
    const currentStep = this.steps.get(key);
    if (!currentStep) return;

    if (currentStep.status === status) return;

    this.steps.set(key, {
      ...currentStep,
      status,
    });

    this.emit();
  }

  markStepLoading(key: BootStepKey) {
    this.setStepStatus(key, "loading");
  }

  markStepReady(key: BootStepKey) {
    this.setStepStatus(key, "ready");
  }

  markStepError(key: BootStepKey) {
    this.setStepStatus(key, "error");
  }

  getSnapshot(): BootReadinessSnapshot {
    const steps = Array.from(this.steps.values());
    const requiredSteps = steps.filter((step) => step.required);
    const readyRequiredSteps = requiredSteps.filter((step) => step.status === "ready");
    const hasError = requiredSteps.some((step) => step.status === "error");
    const progress = requiredSteps.length
      ? Math.round((readyRequiredSteps.length / requiredSteps.length) * 100)
      : 100;

    return {
      progress,
      isReady: requiredSteps.length === 0 || readyRequiredSteps.length === requiredSteps.length,
      hasError,
      steps,
    };
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.getSnapshot());

    return () => {
      this.listeners.delete(listener);
    };
  }

  async waitForReady() {
    const snapshot = this.getSnapshot();
    if (snapshot.isReady || snapshot.hasError) return snapshot;

    return new Promise<BootReadinessSnapshot>((resolve) => {
      const unsubscribe = this.subscribe((nextSnapshot) => {
        if (!nextSnapshot.isReady && !nextSnapshot.hasError) return;
        unsubscribe();
        resolve(nextSnapshot);
      });
    });
  }

  private emit() {
    const snapshot = this.getSnapshot();
    this.listeners.forEach((listener) => listener(snapshot));
  }
}

export const bootReadiness = new BootReadiness();
