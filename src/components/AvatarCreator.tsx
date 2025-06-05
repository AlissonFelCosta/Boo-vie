import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Check, Shuffle, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const HAIR_STYLES = Array.from({ length: 19 }, (_, i) => ({
  id: `short${String(i+1).padStart(2, '0')}`,
  name: `Curto ${i+1}`
})).concat(
  Array.from({ length: 26 }, (_, i) => ({
    id: `long${String(i+1).padStart(2, '0')}`,
    name: `Longo ${i+1}`
  }))
);

const EYES_STYLES = Array.from({ length: 26 }, (_, i) => ({
  id: `variant${String(i+1).padStart(2, '0')}`,
  name: `Estilo ${i+1}`
}));

const MOUTH_STYLES = Array.from({ length: 30 }, (_, i) => ({
  id: `variant${String(i+1).padStart(2, '0')}`,
  name: `Estilo ${i+1}`
}));

const EYEBROWS_STYLES = Array.from({ length: 15 }, (_, i) => ({
  id: `variant${String(i+1).padStart(2, '0')}`,
  name: `Estilo ${i+1}`
}));

const GLASSES_STYLES = [
  { id: "none", name: "Nenhum" },
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `variant${String(i+1).padStart(2, '0')}`,
    name: `Estilo ${i+1}`
  }))
];

const EARS_STYLES = [
  { id: "none", name: "Nenhum" },
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `variant${String(i+1).padStart(2, '0')}`,
    name: `Estilo ${i+1}`
  }))
];

const FEATURES = [
  { id: "none", name: "Nenhum" },
  { id: "birthmark", name: "Marca de Nascimento" },
  { id: "blush", name: "Blush" },
  { id: "freckles", name: "Sardas" },
  { id: "mustache", name: "Bigode" }
];

// Common skin colors
const SKIN_COLORS = [
  { color: "#F2D3B1", name: "Claro" },
  { color: "#EDB98A", name: "Médio" },
  { color: "#D08B5B", name: "Moreno" },
  { color: "#AE5D29", name: "Escuro" },
  { color: "#614335", name: "Muito Escuro" }
];

// Common hair colors
const HAIR_COLORS = [
  { color: "#090806", name: "Preto" },
  { color: "#A55728", name: "Castanho" },
  { color: "#DEBC99", name: "Loiro" },
  { color: "#B86B35", name: "Ruivo" },
  { color: "#AFAFAF", name: "Grisalho" },
  { color: "#FFFFFF", name: "Branco" },
  { color: "#9E1F63", name: "Rosa" },
  { color: "#592454", name: "Roxo" },
  { color: "#4A80F0", name: "Azul" }
];

// Background colors
const BG_COLORS = [
  { color: "#FFFFFF", name: "Branco" },
  { color: "#F0F0F0", name: "Cinza Claro" },
  { color: "#E8F4FF", name: "Azul Claro" },
  { color: "#FFEBE8", name: "Rosa Claro" },
  { color: "#EFFFED", name: "Verde Claro" },
  { color: "#FFF9E8", name: "Amarelo Claro" }
];

// Constants for preview generation
const PREVIEW_SKIN_COLOR = "#F2D3B1";
const PREVIEW_HAIR_COLOR = "#090806";
const PREVIEW_SEED = "preview";

export default function AvatarCreator() {
  const { profile, updateUserProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [seed, setSeed] = useState(profile?.uid || "recomendify");
  
  // Avatar options
  const [avatarOptions, setAvatarOptions] = useState({
    skinColor: "#F2D3B1",
    hairColor: "#A55728",
    backgroundColor: "#FFFFFF",
    hair: "short01",
    eyes: "variant01",
    eyebrows: "variant01",
    mouth: "variant01",
    glasses: "none",
    earrings: "none",
    features: "none",
    glassesProbability: 0,
    earringsProbability: 0,
    featuresProbability: 0
  });
  
  const [previewUrl, setPreviewUrl] = useState(profile?.avatar || "");
  
  // Update preview URL when options change
  useEffect(() => {
    generateAvatarUrl();
  }, [avatarOptions, seed]);
  
  // Function to generate preview image URL for a specific feature
  const generateFeaturePreviewUrl = (feature, value) => {
    // Remove # from color hex codes
    const skinColorHex = PREVIEW_SKIN_COLOR.replace("#", "");
    const hairColorHex = PREVIEW_HAIR_COLOR.replace("#", "");
    
    // Base URL with standard avatar parts
    let url = `https://api.dicebear.com/9.x/adventurer/svg` +
      `?seed=${PREVIEW_SEED}` +
      `&skinColor=${skinColorHex}` +
      `&hairColor=${hairColorHex}` +
      `&hair=short01` +
      `&eyes=variant01` +
      `&eyebrows=variant01` +
      `&mouth=variant01`;
    
    // Add the specific feature we're previewing
    switch (feature) {
      case 'hair':
        url = url.replace('&hair=short01', `&hair=${value}`);
        break;
      case 'eyes':
        url = url.replace('&eyes=variant01', `&eyes=${value}`);
        break;
      case 'mouth':
        url = url.replace('&mouth=variant01', `&mouth=${value}`);
        break;
      case 'eyebrows':
        url = url.replace('&eyebrows=variant01', `&eyebrows=${value}`);
        break;
      case 'glasses':
        if (value !== 'none') {
          url += `&glasses=${value}&glassesProbability=100`;
        }
        break;
      case 'earrings':
        if (value !== 'none') {
          url += `&earrings=${value}&earringsProbability=100`;
        }
        break;
      case 'features':
        if (value !== 'none') {
          url += `&features=${value}&featuresProbability=100`;
        }
        break;
      default:
        break;
    }
    
    return url;
  };
  
  const generateAvatarUrl = () => {
    // Get options
    const {
      skinColor,
      hairColor,
      backgroundColor,
      hair,
      eyes,
      eyebrows,
      mouth,
      glasses,
      earrings,
      features,
      glassesProbability,
      earringsProbability,
      featuresProbability
    } = avatarOptions;
    
    // Remove # from color hex codes
    const skinColorHex = skinColor.replace("#", "");
    const hairColorHex = hairColor.replace("#", "");
    const backgroundColorHex = backgroundColor.replace("#", "");
    
    // Construct URL
    const url = `https://api.dicebear.com/9.x/adventurer/svg` +
      `?seed=${seed}` +
      `&skinColor=${skinColorHex}` +
      `&hairColor=${hairColorHex}` +
      `&backgroundColor=${backgroundColorHex}` +
      `&hair=${hair}` +
      `&eyes=${eyes}` +
      `&eyebrows=${eyebrows}` +
      `&mouth=${mouth}` +
      (glasses !== "none" ? `&glasses=${glasses}` : '') +
      (earrings !== "none" ? `&earrings=${earrings}` : '') +
      (features !== "none" ? `&features=${features}` : '') +
      `&glassesProbability=${glassesProbability}` +
      `&earringsProbability=${earringsProbability}` +
      `&featuresProbability=${featuresProbability}`;
    
    setPreviewUrl(url);
  };
  
  const generateRandomSeed = () => {
    const newSeed = Math.random().toString(36).substring(2, 8);
    setSeed(newSeed);
  };
  
  const handleOptionChange = (option: string, value: string | number) => {
    setAvatarOptions(prev => ({
      ...prev,
      [option]: value
    }));
    
    // Set probability to 100 if accessory is selected, 0 if not
    if (option === 'glasses') {
      setAvatarOptions(prev => ({
        ...prev,
        glassesProbability: value !== "none" ? 100 : 0
      }));
    } else if (option === 'earrings') {
      setAvatarOptions(prev => ({
        ...prev,
        earringsProbability: value !== "none" ? 100 : 0
      }));
    } else if (option === 'features') {
      setAvatarOptions(prev => ({
        ...prev,
        featuresProbability: value !== "none" ? 100 : 0
      }));
    }
  };
  
  const saveAvatar = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      await updateUserProfile({ avatar: previewUrl });
      toast.success("Avatar atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar avatar");
      console.error("Error updating avatar:", error);
    } finally {
      setSaving(false);
    }
  };

  // Custom SelectItem component that shows a preview
  const AvatarFeatureItem = ({ value, children, featureType }) => {
    const previewUrl = generateFeaturePreviewUrl(featureType, value);
    
    return (
      <SelectItem value={value} className="flex items-center justify-between">
        <span>{children}</span>
        <Avatar className="w-10 h-10 ml-2">
          <AvatarImage src={previewUrl} alt={`${children} preview`} />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
      </SelectItem>
    );
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Personalizar Avatar</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Preview column */}
        <div className="flex flex-col items-center">
          <div className="bg-gray-50 p-6 rounded-lg mb-4 w-full flex justify-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={previewUrl} alt="Avatar Preview" />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={generateRandomSeed}
              className="flex items-center flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Novo Rosto
            </Button>
            
            <Button
              className="bg-recomendify-purple hover:bg-recomendify-purple-dark flex-1"
              size="sm"
              disabled={saving}
              onClick={saveAvatar}
            >
              {saving ? "Salvando..." : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Customization columns */}
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-1">Cor da Pele</Label>
            <div className="flex gap-1 flex-wrap">
              {SKIN_COLORS.map(({ color, name }) => (
                <Button
                  key={color}
                  type="button"
                  variant="outline"
                  className={`w-8 h-8 p-0 rounded-full ${avatarOptions.skinColor === color ? 'ring-2 ring-offset-2 ring-recomendify-purple' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleOptionChange('skinColor', color)}
                  title={name}
                />
              ))}
              <Input
                type="color"
                value={avatarOptions.skinColor}
                onChange={(e) => handleOptionChange('skinColor', e.target.value)}
                className="w-8 h-8 p-0 rounded-full cursor-pointer"
              />
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-1">Cor do Cabelo</Label>
            <div className="flex gap-1 flex-wrap">
              {HAIR_COLORS.map(({ color, name }) => (
                <Button
                  key={color}
                  type="button"
                  variant="outline"
                  className={`w-8 h-8 p-0 rounded-full ${avatarOptions.hairColor === color ? 'ring-2 ring-offset-2 ring-recomendify-purple' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleOptionChange('hairColor', color)}
                  title={name}
                />
              ))}
              <Input
                type="color"
                value={avatarOptions.hairColor}
                onChange={(e) => handleOptionChange('hairColor', e.target.value)}
                className="w-8 h-8 p-0 rounded-full cursor-pointer"
              />
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-1">Cor de Fundo</Label>
            <div className="flex gap-1 flex-wrap">
              {BG_COLORS.map(({ color, name }) => (
                <Button
                  key={color}
                  type="button"
                  variant="outline"
                  className={`w-8 h-8 p-0 rounded-full ${avatarOptions.backgroundColor === color ? 'ring-2 ring-offset-2 ring-recomendify-purple' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleOptionChange('backgroundColor', color)}
                  title={name}
                />
              ))}
              <Input
                type="color"
                value={avatarOptions.backgroundColor}
                onChange={(e) => handleOptionChange('backgroundColor', e.target.value)}
                className="w-8 h-8 p-0 rounded-full cursor-pointer"
              />
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-1">Cabelo</Label>
            <Select
              value={avatarOptions.hair}
              onValueChange={(value) => handleOptionChange('hair', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha um estilo" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="none">Nenhum</SelectItem>
                {HAIR_STYLES.map((style) => (
                  <AvatarFeatureItem key={style.id} value={style.id} featureType="hair">
                    {style.name}
                  </AvatarFeatureItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-1">Olhos</Label>
            <Select
              value={avatarOptions.eyes}
              onValueChange={(value) => handleOptionChange('eyes', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha um estilo" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {EYES_STYLES.map((style) => (
                  <AvatarFeatureItem key={style.id} value={style.id} featureType="eyes">
                    {style.name}
                  </AvatarFeatureItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-1">Sobrancelhas</Label>
            <Select
              value={avatarOptions.eyebrows}
              onValueChange={(value) => handleOptionChange('eyebrows', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha um estilo" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {EYEBROWS_STYLES.map((style) => (
                  <AvatarFeatureItem key={style.id} value={style.id} featureType="eyebrows">
                    {style.name}
                  </AvatarFeatureItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-1">Boca</Label>
            <Select
              value={avatarOptions.mouth}
              onValueChange={(value) => handleOptionChange('mouth', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha um estilo" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {MOUTH_STYLES.map((style) => (
                  <AvatarFeatureItem key={style.id} value={style.id} featureType="mouth">
                    {style.name}
                  </AvatarFeatureItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-1">Óculos</Label>
            <Select
              value={avatarOptions.glasses}
              onValueChange={(value) => handleOptionChange('glasses', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha um estilo" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {GLASSES_STYLES.map((style) => (
                  <AvatarFeatureItem key={style.id} value={style.id} featureType="glasses">
                    {style.name}
                  </AvatarFeatureItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-1">Orelhas</Label>
            <Select
              value={avatarOptions.earrings}
              onValueChange={(value) => handleOptionChange('earrings', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha um estilo" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {EARS_STYLES.map((style) => (
                  <AvatarFeatureItem key={style.id} value={style.id} featureType="earrings">
                    {style.name}
                  </AvatarFeatureItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-1">Extras</Label>
            <Select
              value={avatarOptions.features}
              onValueChange={(value) => handleOptionChange('features', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha um estilo" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {FEATURES.map((feature) => (
                  <AvatarFeatureItem key={feature.id} value={feature.id} featureType="features">
                    {feature.name}
                  </AvatarFeatureItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
