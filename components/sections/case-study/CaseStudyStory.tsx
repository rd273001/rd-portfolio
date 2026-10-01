import { Container } from "@/components/primitives";
import { getMetricsByIds } from "@/content/metrics";
import type { CaseStudyStory as CaseStudyStoryContent, Metric } from "@/content/types";

import { AndroidPhoneFrame } from "../mobile-showcase/AndroidPhoneFrame";
import { CaseStudyStoryMotion } from "./CaseStudyStoryMotion";

type CaseStudyStoryProps = {
  story: CaseStudyStoryContent;
};

function MetricCallouts({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) {
    return null;
  }

  return (
    <>
      <dl className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            data-case-story-metric
            className="rounded-2xl border border-border bg-background p-3.5 sm:p-5"
          >
            <dt className="text-xs leading-4 text-muted sm:text-sm sm:leading-5">
              {metric.label}
            </dt>
            <dd
              className="mt-2 text-2xl font-semibold leading-[1.12] tracking-[-0.04em] tabular-nums max-[360px]:text-[1.375rem] sm:mt-3 sm:text-2xl lg:text-3xl"
            >
              {metric.value}
            </dd>
            {metric.previous && metric.current ? (
              <p className="mt-2 text-sm leading-6 text-muted">
                {metric.previous} to {metric.current}
                {metric.percentage ? ` (${metric.percentage})` : ""}
              </p>
            ) : null}
          </div>
        ))}
      </dl>
    </>
  );
}

export function CaseStudyStory({ story }: CaseStudyStoryProps) {
  const narrative = story.narrative.filter(
    (block) => block.title.trim() && block.body.trim(),
  );
  const chapters = story.chapters.filter(
    (chapter) => chapter.title.trim() && chapter.body.trim(),
  );

  const visual = chapters.find(
    (chapter) => chapter.screenshot && !chapter.screenshot.src.startsWith("TODO_"),
  )?.screenshot;

  if (narrative.length === 0 && chapters.length === 0) {
    return null;
  }

  return (
    <CaseStudyStoryMotion>
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted">
            {story.eyebrow}
          </p>
          <h2
            id="case-study-story-title"
            className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl"
          >
            {story.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-muted sm:text-lg sm:leading-8">
            {story.lead}
          </p>
        </div>

        {narrative.length > 0 ? (
          <div className="mt-10 grid gap-5">
            {narrative.map((block) => (
              <article
                key={block.id}
                className="rounded-3xl border border-border bg-surface p-5 sm:p-6"
              >
                {block.eyebrow ? (
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted">
                    {block.eyebrow}
                  </p>
                ) : null}
                <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em]">
                  {block.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-foreground sm:text-base sm:leading-7">
                  {block.body}
                </p>
              </article>
            ))}
          </div>
        ) : null}

        {chapters.length > 0 ? (
          <div className="mt-10 sm:mt-14">
            <div data-case-story-stage>
              <ol data-case-story-steps className="hidden">
                {chapters.map((chapter, index) => (
                  <li
                    key={chapter.id}
                    data-case-story-step
                    data-active={index === 0 ? "true" : "false"}
                    className="font-mono text-xs font-medium uppercase tracking-[0.16em]"
                  >
                    {chapter.eyebrow}
                  </li>
                ))}
              </ol>
              <div
                data-case-story-progress-track
                className="hidden"
                aria-hidden="true"
              >
                <div data-case-story-progress />
              </div>
              <div data-case-story-layout>
                {visual ? (
                  <div data-case-story-visual className="hidden lg:block">
                    <AndroidPhoneFrame
                      screenshot={visual.src}
                      alt={visual.alt}
                      size="stack"
                      sizes="(min-width: 1024px) 240px, 176px"
                    />
                  </div>
                ) : null}
                <ol data-case-story-chapters>
                  {chapters.map((chapter) => {
                    const metrics = getMetricsByIds(chapter.metricIds).filter(
                      (metric) => metric.status === "verified",
                    );
                    const screenshot =
                      chapter.screenshot &&
                      !chapter.screenshot.src.startsWith("TODO_")
                        ? chapter.screenshot
                        : undefined;

                    return (
                      <li
                        key={chapter.id}
                        data-case-story-chapter
                        {...(screenshot
                          ? { "data-case-story-reveal": "" }
                          : {})}
                        className="w-full rounded-3xl border border-border bg-surface p-5 sm:p-7"
                      >
                        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted">
                          {chapter.eyebrow}
                        </p>
                        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-balance text-foreground sm:text-3xl">
                          {chapter.title}
                        </h3>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
                          {chapter.body}
                        </p>
                        <MetricCallouts metrics={metrics} />
                        {screenshot ? (
                          <div
                            data-case-story-shot
                            className="mx-auto mt-6 w-full max-w-52 lg:hidden"
                          >
                            <AndroidPhoneFrame
                              screenshot={screenshot.src}
                              alt={screenshot.alt}
                              size="stack"
                              sizes="208px"
                            />
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </CaseStudyStoryMotion>
  );
}
