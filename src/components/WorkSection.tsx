import WorkCard from "./WorkCard";
import SectionHeading from "./SectionHeading";
import type { Work, WorkSection as WorkSectionType } from "../data/works";
import { workSections } from "../data/works";

type Props = {
  section: WorkSectionType;
  works: Work[];
};

export default function WorkSection({ section, works }: Props) {
  const meta = workSections.find((item) => item.key === section)!;
  if (!works.length) return null;

  return (
    <section id={section} className={`work-section work-section-${section}`}>
      <div className="work-section-heading">
        <SectionHeading title={meta.title} description={meta.capability} />
      </div>
      <div
        className="horizontal-gallery"
        aria-label={`${meta.title}作品横向浏览`}
        onWheel={(event) => {
          if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.currentTarget.scrollLeft += event.deltaY;
          }
        }}
      >
        {works.map((work) => (
          <WorkCard key={work.slug} work={work} summaryMode="platform" />
        ))}
      </div>
    </section>
  );
}
