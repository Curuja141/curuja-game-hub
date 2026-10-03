import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, Copy, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { CONTACT_EMAIL, DISCORD_USERNAME, SOCIAL_LINKS, services } from "@/data/site";
import { ArcadeButton, SectionHeading } from "./GamePieces";

const schema = z.object({
  name: z.string().trim().min(2, "Tell me your name (at least 2 characters)."),
  email: z.string().trim().email("Enter a valid email address."),
  service: z.string().min(1, "Choose a project type."),
  message: z.string().trim().min(10, "Tell me a little more about your project (at least 10 characters)."),
});
type FormData = z.infer<typeof schema>;
export function Contact({ selectedService }: { selectedService: string }) {
  const copyDiscord = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(DISCORD_USERNAME);
      toast.success(`Discord username copied: ${DISCORD_USERNAME}`);
    } catch {
      toast(`My Discord: ${DISCORD_USERNAME}`);
    }
  };
  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", service: "", message: "" } });
  useEffect(() => { if (selectedService) setValue("service", selectedService, { shouldValidate: true }); }, [selectedService, setValue]);
  const onSubmit = (data: FormData) => {
    const subject = `Project inquiry: ${data.service}`;
    const body = `Hi Curuja!\n\n${data.message}\n\nProject type: ${data.service}\nName: ${data.name}\nEmail: ${data.email}`;
    toast.success("Quest accepted! Opening your email app…");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return <section id="contact" className="contact-section section-pad"><div className="night-stars" aria-hidden="true">✦　·　✧　·　✦　·　✧　·　✦　·　✧　·　✦</div><div className="page-container contact-content"><SectionHeading eyebrow="// FINAL LEVEL" title="READY PLAYER 2?" subtitle="Tell me about your project and let's build something awesome." light/><div className="contact-layout"><div className="contact-form-wrap reveal"><div className="form-header"><span className="pixel-label">NEW QUEST</span><span>✦ ✦ ✦</span></div><form onSubmit={handleSubmit(onSubmit)} noValidate><div className="form-two"><label>YOUR NAME<input {...register("name")} placeholder="Your name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined}/>{errors.name && <small id="name-error" className="form-error">{errors.name.message}</small>}</label><label>EMAIL ADDRESS<input type="email" {...register("email")} placeholder="you@example.com" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined}/>{errors.email && <small id="email-error" className="form-error">{errors.email.message}</small>}</label></div><label>PROJECT TYPE<Controller name="service" control={control} render={({ field }) => <select {...field} aria-invalid={!!errors.service} aria-describedby={errors.service ? "service-error" : undefined}><option value="">Choose your quest...</option>{services.map(item => <option key={item.title} value={item.title}>{item.title}</option>)}<option value="Other">Other</option></select>}/>{errors.service && <small id="service-error" className="form-error">{errors.service.message}</small>}</label><label>YOUR MESSAGE<textarea {...register("message")} rows={5} placeholder="Tell me about your project, timeline, and what you're imagining..." aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined}/>{errors.message && <small id="message-error" className="form-error">{errors.message.message}</small>}</label><ArcadeButton type="submit" className="button-sunny submit-button"><Send size={19}/> SEND QUEST REQUEST <ArrowUpRight size={19}/></ArcadeButton></form></div><aside className="quick-contact reveal"><span className="pixel-label">// OTHER WAYS TO CONNECT</span><h3>LET'S TALK!</h3><p>Prefer a quick message? Find me here.</p><div className="contact-links"><a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer"><span className="social-icon">𝕏</span><span>DM me on X<strong>@CurujaEdits</strong></span><ArrowUpRight/></a><a href={`mailto:${CONTACT_EMAIL}`}><span className="social-icon"><Mail size={23}/></span><span>Send an email<strong>{CONTACT_EMAIL}</strong></span><ArrowUpRight/></a>{DISCORD_USERNAME ? <a href="#contact" role="button" onClick={copyDiscord}><span className="social-icon">#</span><span>Discord<strong>{DISCORD_USERNAME}</strong></span><Copy/></a> : SOCIAL_LINKS.discord ? <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer"><span className="social-icon">#</span><span>Discord<strong>Let's chat</strong></span><ArrowUpRight/></a> : <div className="contact-link-disabled"><span className="social-icon">#</span><span>Discord<strong>Coming soon</strong></span></div>}{SOCIAL_LINKS.youtube ? <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer"><span className="social-icon">▶</span><span>YouTube<strong>Watch the channel</strong></span><ArrowUpRight/></a> : <div className="contact-link-disabled"><span className="social-icon">▶</span><span>YouTube<strong>Coming soon</strong></span></div>}</div><div className="contact-side-note">✦ YOUR NEXT GREAT VIDEO STARTS HERE ✦</div></aside></div></div></section>;
}
