type ViaCepResponse = {
  bairro?: string;
  cep?: string;
  complemento?: string;
  erro?: boolean;
  localidade?: string;
  logradouro?: string;
  uf?: string;
};

export async function GET(_request: Request, context: { params: Promise<{ cep: string }> }) {
  const { cep: rawPostalCode } = await context.params;
  const postalCode = rawPostalCode.replace(/\D/g, "");

  if (!/^\d{8}$/.test(postalCode)) {
    return Response.json({ message: "Informe um CEP válido com 8 dígitos." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${postalCode}/json/`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) throw new Error("ViaCEP indisponível");
    const address = await response.json() as ViaCepResponse;
    if (address.erro) return Response.json({ message: "CEP não encontrado." }, { status: 404 });

    return Response.json({
      postalCode: address.cep ?? postalCode,
      street: address.logradouro ?? "",
      complement: address.complemento ?? "",
      neighborhood: address.bairro ?? "",
      city: address.localidade ?? "",
      state: address.uf ?? "",
    });
  } catch {
    return Response.json({ message: "Não foi possível consultar o CEP agora. Tente novamente." }, { status: 502 });
  }
}
