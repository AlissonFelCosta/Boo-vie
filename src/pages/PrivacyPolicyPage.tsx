
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 pl-[70px] md:pl-[200px] overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-boovie-dark mb-4">Política de Privacidade</h1>
              <p className="text-gray-600">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-orange">1. Informações que Coletamos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1.1 Informações Fornecidas por Você</h4>
                  <p className="text-gray-600">
                    Coletamos informações que você nos fornece diretamente, incluindo:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                    <li>Nome e endereço de e-mail ao criar uma conta</li>
                    <li>Avaliações e reviews de filmes e livros</li>
                    <li>Mensagens enviadas através do chat</li>
                    <li>Preferências e configurações de perfil</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">1.2 Informações Coletadas Automaticamente</h4>
                  <p className="text-gray-600">
                    Quando você utiliza nosso serviço, coletamos automaticamente:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                    <li>Informações sobre seu dispositivo e navegador</li>
                    <li>Endereço IP e localização aproximada</li>
                    <li>Dados de uso e navegação no site</li>
                    <li>Cookies e tecnologias similares</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-teal">2. Como Utilizamos suas Informações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Utilizamos suas informações para:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Fornecer e manter nossos serviços</li>
                  <li>Personalizar recomendações de filmes e livros</li>
                  <li>Facilitar a comunicação entre usuários</li>
                  <li>Melhorar a experiência do usuário</li>
                  <li>Enviar notificações sobre atividades relevantes</li>
                  <li>Prevenir fraudes e garantir a segurança</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-orange">3. Compartilhamento de Informações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Não vendemos suas informações pessoais. Podemos compartilhar suas informações apenas nas seguintes situações:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Com outros usuários, quando você publica reviews ou participa de discussões</li>
                  <li>Com prestadores de serviços que nos ajudam a operar a plataforma</li>
                  <li>Quando exigido por lei ou para proteger nossos direitos</li>
                  <li>Em caso de fusão, aquisição ou venda de ativos</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-teal">4. Segurança dos Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger 
                  suas informações contra acesso não autorizado, alteração, divulgação ou destruição. 
                  Isso inclui:
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-4 space-y-1">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Controles de acesso rigorosos</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Auditorias regulares de segurança</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-orange">5. Seus Direitos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Você tem os seguintes direitos em relação às suas informações pessoais:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Acesso:</strong> Solicitar acesso às informações que temos sobre você</li>
                  <li><strong>Correção:</strong> Solicitar correção de informações incorretas</li>
                  <li><strong>Exclusão:</strong> Solicitar a exclusão de suas informações</li>
                  <li><strong>Portabilidade:</strong> Solicitar uma cópia de seus dados</li>
                  <li><strong>Oposição:</strong> Opor-se ao processamento de suas informações</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Para exercer esses direitos, entre em contato conosco através do e-mail: 
                  <span className="text-boovie-orange font-semibold"> privacidade@boovie.com</span>
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-teal">6. Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência, 
                  analisar o uso do site e personalizar conteúdo. Você pode gerenciar suas 
                  preferências de cookies através das configurações do seu navegador.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-orange">7. Retenção de Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Mantemos suas informações pessoais pelo tempo necessário para cumprir os 
                  propósitos descritos nesta política, salvo quando um período maior for 
                  exigido ou permitido por lei.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-boovie-teal">8. Alterações nesta Política</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos 
                  sobre alterações significativas através do site ou por e-mail. O uso 
                  continuado de nossos serviços após as alterações constitui aceitação da 
                  política atualizada.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-boovie-orange">9. Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:
                </p>
                <div className="mt-4 space-y-2 text-gray-600">
                  <p><strong>E-mail:</strong> privacidade@boovie.com</p>
                  <p><strong>Endereço:</strong> São Paulo, SP, Brasil</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
