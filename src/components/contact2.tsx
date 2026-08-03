"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckIcon,
  GlobeIcon,
  LoaderIcon,
  MailIcon,
  PhoneIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { sendContactEmail } from "@/lib/emailjs";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

import "./css/contact.css";
import "./css/reveal.css";

interface ContactFormDetailsProps {
  title: string;
  description: string;
  phone: string;
  email: string;
  web: { label: string; url: string };
  formSubheading: string;
  formHeading: string;
  successMessage: string;
  submitLabel: string;
  submittingLabel: string;
  className?: string;
}

interface Contact2Props extends ContactFormDetailsProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
}
type Props = Partial<Contact2Props>;

const defaultProps: Contact2Props = {
  title: "Contact Me",
  description: "Interested in working together? Whether you’re looking for a web developer for your project or a new team member for your company, I’m open to opportunities where I can grow, contribute, and create impactful solutions.",
  phone: "+63 9663971016",
  email: "gabrielluigigutierrez18@gmail.com",
  web: {
    label: "gabriel-port-zeta.vercel.app",
    url: "https://gabriel-port-zeta.vercel.app/",
  },
  formSubheading: "We usually reply within one business day.",
  formHeading: "Send us a message",
  successMessage: "Thanks — your message is in our inbox.",
  submitLabel: "Send message",
  submittingLabel: "Sending…",
};

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

type SubmitStatus = "idle" | "sending" | "sent" | "error";

const Contact2 = (props: Props) => {
  const {
    title,
    description,
    phone,
    email,
    web,
    formHeading,
    formSubheading,
    successMessage,
    submitLabel,
    submittingLabel,
    className,
    onSubmit,
  } = { ...defaultProps, ...props };

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const { ref, revealClass } = useReveal<HTMLElement>();

  // Set by the Web Solutions pricing page: /?subject=...#contact seeds the
  // Subject field with the plan the visitor picked.
  const [searchParams] = useSearchParams();
  const presetSubject = searchParams.get("subject") ?? "";

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: presetSubject,
      message: "",
    },
  });

  const handleFormSubmit = async (data: ContactFormData) => {
    setStatus("sending");

    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await sendContactEmail(data);
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      form.setError("root", {
        message: "Something went wrong. Please try again.",
      });
    }
  };

  // Dismiss the confirmation on its own; the failure state waits to be closed.
  useEffect(() => {
    if (status !== "sent") {
      return;
    }

    const timeoutId = window.setTimeout(() => setStatus("idle"), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [status]);

  // Escape closes the dialog and the page behind it stops scrolling — except
  // mid-send, which is not cancellable.
  useEffect(() => {
    if (status === "idle") {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && status !== "sending") {
        setStatus("idle");
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [status]);

  return (
    // Same container tokens as the CSS-styled sections (see App.css :root) so
    // the contact block lines up with everything above it.
    <section
      ref={ref}
      className={cn("px-[var(--page-gutter)] py-28", revealClass, className)}
    >
      <div className="mx-auto w-full max-w-[var(--page-max)]">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
          <div className="reveal-item flex flex-1 flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-semibold tracking-tight text-pretty md:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="text-muted-foreground lg:text-xl lg:text-balance">
                {description}
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <a
                href={`tel:${phone}`}
                className="group flex items-center gap-3"
              >
                <PhoneIcon className="size-5 text-muted-foreground" />
                <span className="group-hover:underline">{phone}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="group flex items-center gap-3"
              >
                <MailIcon className="size-5 text-muted-foreground" />
                <span className="group-hover:underline">{email}</span>
              </a>
              <a
                href={web.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${web.label} (opens in new tab)`}
                className="group flex items-center gap-3"
              >
                <GlobeIcon className="size-5 text-muted-foreground" />
                <span className="group-hover:underline">{web.label}</span>
              </a>
            </div>
          </div>
          <div className="reveal-item reveal-delay-2 flex-1">
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-6 rounded-xl bg-muted/50 p-8 md:p-10"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold tracking-tight text-balance">
                  {formHeading}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {formSubheading}
                </p>
              </div>
              <FieldGroup className="gap-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    control={form.control}
                    name="firstName"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          First Name <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Jordan"
                          className="bg-background"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="lastName"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Last Name <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Kim"
                          className="bg-background"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Email <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="you@company.com"
                        className="bg-background"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="subject"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Subject <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Question about blocks"
                        className="bg-background"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="message"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Message <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Tell us what you are building…"
                        rows={4}
                        className="bg-background"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {form.formState.errors.root && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.root.message}
                  </p>
                )}
                {/* Base UI's Button defaults to type="button"; without this the
                    click never submits the form. */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <LoaderIcon className="size-4 animate-spin" aria-hidden />
                  ) : null}
                  {form.formState.isSubmitting ? submittingLabel : submitLabel}
                </Button>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>

      {/* Rendered inside the section rather than portalled to <body> so it
          inherits the surrounding theme — the home page wraps this section in
          `dark`, and a portal would escape that and render light. */}
      {status !== "idle" && (
        <div
          className="contact-status-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
          onClick={() => {
            if (status !== "sending") {
              setStatus("idle");
            }
          }}
        >
          <div
            role={status === "sending" ? "status" : "alertdialog"}
            aria-live="polite"
            aria-busy={status === "sending"}
            onClick={(event) => event.stopPropagation()}
            className="contact-status-card flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border bg-background p-8 text-center shadow-xl"
          >
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-full border",
                status === "error"
                  ? "border-destructive/30 text-destructive"
                  : "border-border text-foreground",
              )}
            >
              {status === "sending" && (
                <LoaderIcon className="size-5 animate-spin" aria-hidden />
              )}
              {status === "sent" && <CheckIcon className="size-5" aria-hidden />}
              {status === "error" && (
                <TriangleAlertIcon className="size-5" aria-hidden />
              )}
            </span>

            <div className="flex flex-col gap-1.5">
              <p className="font-medium tracking-tight">
                {status === "sending" && "Sending your email…"}
                {status === "sent" && "Email sent"}
                {status === "error" && "Email not sent"}
              </p>
              <p className="text-sm text-balance text-muted-foreground">
                {status === "sending" && "Hang tight, this only takes a moment."}
                {status === "sent" && successMessage}
                {status === "error" &&
                  "Something went wrong on the way out. Please try again."}
              </p>
            </div>

            {status !== "sending" && (
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-1 text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export { Contact2 };
