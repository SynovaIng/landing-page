import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactClientEmailProps {
  logoUrl: string;
  name: string;
  service: string;
  message: string;
  contactEmail: string;
}

export default function ContactClientEmail({
  logoUrl,
  name,
  service,
  message,
  contactEmail,
}: ContactClientEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Recibimos tu solicitud en SYNOVA</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img src={logoUrl} alt="Synova" width="220" style={logo} />
          </Section>
          <Section style={content}>
            <Heading style={heading}>¡Gracias por contactarnos, {name}!</Heading>
            <Text style={paragraph}>
              Recibimos tu solicitud correctamente y uno de nuestros especialistas te responderá en menos de 24 horas.
            </Text>
            <Section style={card}>
              <Text style={label}>Servicio</Text>
              <Text style={value}>{service}</Text>
              <Hr style={hr} />
              <Text style={label}>Mensaje recibido</Text>
              <Text style={value}>{message}</Text>
            </Section>
            <Text style={paragraph}>
              Si necesitas agregar información, puedes responder a este correo o escribir a {contactEmail}.
            </Text>
            <Text style={footer}>SYNOVA · Soluciones eléctricas de alto estándar</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f5f7fa",
  margin: "0 auto",
  fontFamily: "Inter, Arial, sans-serif",
  color: "#0f172a",
};

const container = {
  margin: "24px auto",
  maxWidth: "560px",
  width: "100%",
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  overflow: "hidden",
};

const header = {
  backgroundColor: "#1f2937",
  width: "100%",
  padding: "16px 24px",
};

const logo = {
  display: "block",
  width: "220px",
  maxWidth: "100%",
  height: "auto",
  objectFit: "contain" as const,
};

const content = {
  padding: "24px",
};

const heading = {
  fontFamily: "Montserrat, Arial, sans-serif",
  fontSize: "24px",
  color: "#1f2937",
  margin: "0 0 12px",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#475569",
};

const card = {
  marginTop: "16px",
  marginBottom: "16px",
  backgroundColor: "#f8fafc",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  padding: "16px",
};

const label = {
  fontSize: "12px",
  color: "#6b7280",
  textTransform: "uppercase" as const,
  margin: "0 0 6px",
};

const value = {
  fontSize: "14px",
  color: "#0f172a",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "12px 0",
};

const footer = {
  marginTop: "18px",
  fontSize: "12px",
  color: "#6b7280",
};
