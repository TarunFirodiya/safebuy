import { ImageResponse } from "next/og";
import { getServiceBySlug, categoryLabels } from "@/lib/services";
import { formatINR } from "@/lib/utils";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              background: "#635bff",
              color: "white",
              fontSize: "14px",
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: "100px",
            }}
          >
            Jumbo SafeBuy
          </div>
          {service && (
            <div
              style={{
                color: "#6b7280",
                fontSize: "14px",
                background: "#f6f9fc",
                padding: "6px 14px",
                borderRadius: "100px",
                border: "1px solid #e6ebf1",
              }}
            >
              {categoryLabels[service.categories[0]]}
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "#0a2540",
              lineHeight: 1.1,
              maxWidth: "700px",
            }}
          >
            {service?.name ?? "Service Not Found"}
          </div>

          {service && (
            <div style={{ fontSize: "22px", color: "#6b7280", maxWidth: "640px" }}>
              {service.shortDescription}
            </div>
          )}

          {service && (
            <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#635bff",
                }}
              >
                {formatINR(service.price)}
              </div>
              <div
                style={{
                  fontSize: "18px",
                  color: "#6b7280",
                  alignSelf: "flex-end",
                  paddingBottom: "6px",
                }}
              >
                Fixed price · {service.deliveryTime}
              </div>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div
          style={{
            marginTop: "40px",
            paddingTop: "24px",
            borderTop: "1px solid #e6ebf1",
            color: "#9ca3af",
            fontSize: "14px",
          }}
        >
          jumbosafebuy.in · Fixed-price legal services for Bangalore home buyers
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
