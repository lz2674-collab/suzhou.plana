import PageTransition from "../components/PageTransition";
import { type FormEvent, useMemo, useState } from "react";

const projectTypes = [
  "品牌广告 / TVC",
  "活动影像",
  "竖屏短剧",
  "文旅项目",
  "IP概念片",
  "MV / 演唱会视觉",
  "AI视觉资产",
  "其他",
];

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const startedAt = useMemo(() => Date.now(), []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email,
      company: String(formData.get("company") ?? "").trim(),
      projectType: String(formData.get("projectType") ?? "").trim(),
      budget: String(formData.get("budget") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      pageUrl: window.location.href,
      startedAt,
      website: String(formData.get("website") ?? ""),
    };

    if (!payload.name || !payload.email || !payload.projectType || !payload.message) {
      setStatus("error");
      setStatusMessage("请填写姓名、邮箱、项目类型和项目描述。");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setStatusMessage("请输入有效的邮箱地址。");
      return;
    }

    setStatus("loading");
    setStatusMessage("正在提交...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error || "提交失败，请稍后再试。");
      }

      form.reset();
      setStatus("success");
      setStatusMessage("已收到你的项目信息，我们会尽快回复。");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "提交失败，请稍后再试。");
    }
  };

  return (
    <PageTransition>
      <section className="contact-page container">
          <div>
            <span>Contact</span>
            <h1>让我们从一个创意开始。</h1>
            <p>告诉我们项目的目标、周期与想要抵达的观众。PlanA 会从创意、技术路径和可交付影像三个层面回应。</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <input className="contact-honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label>
              姓名
              <input type="text" name="name" required autoComplete="name" />
            </label>
            <label>
              公司
              <input type="text" name="company" />
            </label>
            <label>
              项目类型
              <select name="projectType" defaultValue="" required>
                <option value="" disabled>
                  请选择
                </option>
                {projectTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label>
              预算范围
              <input type="text" name="budget" placeholder="例如 20万 - 50万" />
            </label>
            <label>
              邮箱
              <input type="email" name="email" placeholder="name@example.com" required autoComplete="email" />
            </label>
            <label className="full">
              项目描述
              <textarea name="message" rows={6} required />
            </label>
            {statusMessage ? <p className={`contact-status ${status}`}>{statusMessage}</p> : null}
            <button className="button red" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "提交中..." : "提交咨询"}
            </button>
          </form>
      </section>
    </PageTransition>
  );
}
