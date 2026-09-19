type Scheduler = {
  yield?: () => Promise<void>;
  postTask?: (
    callback: () => void,
    options?: { priority?: "user-blocking" | "user-visible" | "background" },
  ) => Promise<unknown>;
};

type Scheduling = {
  isInputPending?: (options?: { includeContinuous?: boolean }) => boolean;
};

function getScheduler(): Scheduler | undefined {
  return (globalThis as { scheduler?: Scheduler }).scheduler;
}

function getScheduling(): Scheduling | undefined {
  if (typeof navigator === "undefined") {
    return undefined;
  }

  return (navigator as Navigator & { scheduling?: Scheduling }).scheduling;
}

export function yieldToMain(): Promise<void> {
  const scheduler = getScheduler();

  if (typeof scheduler?.yield === "function") {
    return scheduler.yield();
  }

  if (typeof scheduler?.postTask === "function") {
    return scheduler.postTask(() => undefined, { priority: "background" }).then(
      () => undefined,
    );
  }

  return new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

export async function yieldUntilQuiet() {
  await yieldToMain();

  const scheduling = getScheduling();
  if (typeof scheduling?.isInputPending !== "function") {
    return;
  }

  for (let i = 0; i < 24; i += 1) {
    if (!scheduling.isInputPending({ includeContinuous: true })) {
      return;
    }

    await yieldToMain();
  }
}

export function runInBackground(callback: () => void) {
  const scheduler = getScheduler();

  if (typeof scheduler?.postTask === "function") {
    void scheduler.postTask(callback, { priority: "background" });
    return;
  }

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(callback, { timeout: 800 });
    return;
  }

  window.setTimeout(callback, 0);
}
