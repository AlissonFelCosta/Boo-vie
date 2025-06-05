
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Mensagem enviada!",
      description: "Obrigado pelo contato. Retornaremos em breve.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 pl-[70px] md:pl-[200px] overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-boovie-dark mb-4">Entre em Contato</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Estamos aqui para ajudar! Entre em contato conosco para dúvidas, 
                sugestões ou feedback sobre o Boovie.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-boovie-orange">Envie sua Mensagem</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Assunto</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="Qual o motivo do contato?"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Descreva sua dúvida, sugestão ou feedback..."
                        rows={6}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-boovie-orange hover:bg-boovie-orange/90">
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-boovie-teal">Informações de Contato</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-boovie-orange mt-1" />
                      <div>
                        <h3 className="font-semibold text-boovie-dark">E-mail</h3>
                        <p className="text-gray-600">contato@boovie.com</p>
                        <p className="text-sm text-gray-500">Respondemos em até 24 horas</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-boovie-teal mt-1" />
                      <div>
                        <h3 className="font-semibold text-boovie-dark">Telefone</h3>
                        <p className="text-gray-600">+55 (11) 99999-9999</p>
                        <p className="text-sm text-gray-500">Segunda a sexta, 9h às 18h</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-boovie-orange mt-1" />
                      <div>
                        <h3 className="font-semibold text-boovie-dark">Endereço</h3>
                        <p className="text-gray-600">
                          São Paulo, SP<br />
                          Brasil
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-boovie-teal mt-1" />
                      <div>
                        <h3 className="font-semibold text-boovie-dark">Horário de Atendimento</h3>
                        <p className="text-gray-600">
                          Segunda a sexta: 9h às 18h<br />
                          Sábados: 9h às 14h<br />
                          Domingos: Fechado
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-boovie-orange">Perguntas Frequentes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-boovie-dark mb-2">Como funciona o sistema de recomendações?</h4>
                      <p className="text-sm text-gray-600">
                        Nosso algoritmo analisa suas avaliações, histórico e preferências para sugerir conteúdo relevante.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-boovie-dark mb-2">O Boovie é gratuito?</h4>
                      <p className="text-sm text-gray-600">
                        Sim! O Boovie é completamente gratuito para todos os usuários.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-boovie-dark mb-2">Como posso sugerir novos recursos?</h4>
                      <p className="text-sm text-gray-600">
                        Use o formulário ao lado ou nos envie um e-mail com suas sugestões e feedback.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
