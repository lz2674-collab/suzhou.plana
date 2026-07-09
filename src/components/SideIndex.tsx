import { useEffect, useState } from "react";

type Item = {
  id: string;
  label: string;
  description?: string;
};

export default function SideIndex({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observers = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element))
      .map((element) => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActive(entry.target.id);
          },
          { rootMargin: "-42% 0px -46% 0px", threshold: 0 }
        );
        observer.observe(element);
        return observer;
      });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [items]);

  return (
    <aside className="side-index" aria-label="页面目录">
      {items.map((item, index) => (
        <a key={item.id} className={active === item.id ? "active" : ""} href={`#${item.id}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{item.label}</strong>
          {item.description ? <small>{item.description}</small> : null}
        </a>
      ))}
    </aside>
  );
}
