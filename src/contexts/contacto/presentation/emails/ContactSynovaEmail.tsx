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

interface ContactSynovaEmailProps {
  logoUrl: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export default function ContactSynovaEmail({
  logoUrl,
  name,
  email,
  phone,
  service,
  message,
}: ContactSynovaEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Nuevo formulario de contacto recibido</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img src={logoUrl} alt="Synova" width="220" style={logo} />
          </Section>
          <Section style={content}>
            <Heading style={heading}>Nuevo contacto desde la web</Heading>

            <Section style={card}>
              <Text style={label}>Nombre</Text>
              <Text style={value}>{name}</Text>
              <Hr style={hr} />

              <Text style={label}>Email</Text>
              <Text style={value}>{email}</Text>
              <Hr style={hr} />

              <Text style={label}>Teléfono</Text>
              <Text style={value}>{phone}</Text>
              <Hr style={hr} />

              <Text style={label}>Servicio</Text>
              <Text style={value}>{service}</Text>
              <Hr style={hr} />

              <Text style={label}>Mensaje</Text>
              <Text style={value}>{message}</Text>
            </Section>

            <Text style={footer}>Enviado desde formulario de contacto de SYNOVA</Text>
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
