import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/solicitar", destination: "/denunciar" },
      { source: "/minhas-solicitacoes", destination: "/minhas-denuncias" },
      { source: "/analise", destination: "/moderacao" },
    ];
  },
};

export default nextConfig;
