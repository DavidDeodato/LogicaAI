import os
import google.generativeai as genai
import asyncio

# --- COLE SUA CHAVE DE API AQUI DENTRO DAS ASPAS ---
API_KEY = "AIzaSyAZcsRdGgzkIKpNYLJ1Xl2mTe-Qj36tNJA"
# ----------------------------------------------------

async def test_model(model_name: str):
    """Tenta enviar uma mensagem para um modelo específico."""
    try:
        print(f"\n🚀 Testando: {model_name}")
        model = genai.GenerativeModel(model_name)
        response = await model.generate_content_async("Oi, tudo bem? Responda em português.")
        print(f"✅ SUCESSO: {model_name} respondeu.")
        # print(f"   Resposta: {response.text[:80]}...") # Descomente para ver a resposta
    except Exception as e:
        print(f"❌ FALHA: {model_name} falhou. Erro: {str(e)[:150]}...")

async def main():
    """
    Função principal para listar e testar todos os modelos compatíveis.
    """
    if API_KEY == "SUA_CHAVE_API_AQUI":
        print("\n❌ ERRO: Por favor, substitua 'SUA_CHAVE_API_AQUI' pela sua chave de API real no script.")
        return

    print("Configurando a API do Gemini...")
    try:
        genai.configure(api_key=API_KEY)

        print("\n🔍 Buscando e testando todos os modelos compatíveis...")
        print("--------------------------------------------------")
        
        compatible_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        
        if not compatible_models:
            print("❌ Nenhum modelo compatível com 'generateContent' foi encontrado para esta chave de API.")
            return

        tasks = [test_model(model_name) for model_name in compatible_models]
        await asyncio.gather(*tasks)
        
        print("\n--------------------------------------------------")
        print("✅ Teste concluído.")

    except Exception as e:
        print(f"\n❌ ERRO GERAL ao tentar listar ou testar os modelos: {e}")


if __name__ == "__main__":
    print("Iniciando verificação e teste de modelos da API do Gemini...")
    asyncio.run(main())
