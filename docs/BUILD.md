# Guia de Build e Desenvolvimento - Vitta

## Pré-requisitos

- Node.js 18+
- Xcode 15+ (com Command Line Tools)
- Conta Apple Developer
- iPhone registrado no Apple Developer Portal

---

## Comandos para Build

### 1. Mudança simples (código TS/JS)

Para alterações em componentes, telas, ViewModels, estilos, etc:

```bash
npx expo run:ios --configuration Release --device
```

O Expo detecta que o código nativo já existe e só recompila o bundle JS.

---

### 2. Adicionou dependência nativa

Quando instalar pacotes que precisam de código nativo (câmera, mapas, notificações, etc):

```bash
npx expo install <nome-do-pacote>
npx expo prebuild --clean
npx expo run:ios --configuration Release --device
```

Exemplos de pacotes nativos:

- `expo-camera`
- `expo-notifications`
- `expo-location`
- `react-native-maps`

---

### 3. Mudou configurações do app

Quando alterar `app.json` (ícone, splash screen, permissões, bundle ID):

```bash
npx expo prebuild
npx expo run:ios --configuration Release --device
```

---

### 4. Algo deu errado / cache bugado

```bash
npx expo run:ios --configuration Release --device --no-build-cache
```

---

### 5. Reset total (último recurso)

```bash
rm -rf ios node_modules
npm install
npx expo prebuild --clean
npx expo run:ios --configuration Release --device
```

---

## Modos de Build

| Modo | Comando | Uso |
|------|---------|-----|
| Release | `--configuration Release` | App standalone, não precisa de Metro |
| Debug | (sem flag) | Conecta ao Metro, hot reload funciona |

### Quando usar cada um

- **Debug**: Durante desenvolvimento ativo, para ver mudanças instantâneas
- **Release**: Para testar versão final ou enviar para App Store

---

## Registrar novo dispositivo

1. Conecte o iPhone ao Mac via USB
2. Abra o Finder e selecione o iPhone
3. Clique no nome do iPhone até aparecer o UDID
4. Copie o UDID
5. Acesse [Apple Developer Portal](https://developer.apple.com/account/resources/devices/list)
6. Adicione o dispositivo com o UDID

---

## Enviar para App Store

### 1. Criar app no App Store Connect

1. Acesse [App Store Connect](https://appstoreconnect.apple.com)
2. Clique em "+" e selecione "New App"
3. Preencha: Nome, Bundle ID (`com.watusalen.vitta`), SKU

### 2. Gerar Archive

```bash
# Abra o projeto no Xcode
open ios/vitta.xcworkspace

# No Xcode:
# 1. Selecione "Any iOS Device (arm64)" como destino
# 2. Menu: Product > Archive
# 3. Aguarde a compilação
```

### 3. Enviar para TestFlight/App Store

1. Após o Archive, abre o Organizer automaticamente
2. Clique em "Distribute App"
3. Selecione "App Store Connect"
4. Siga o wizard até o upload

---

## Troubleshooting

### Erro de assinatura

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/vitta-*
```

### Pods desatualizados

```bash
cd ios
pod install --repo-update
cd ..
```

### Metro não conecta (Debug mode)

Verifique se Mac e iPhone estão na mesma rede Wi-Fi.

### App não abre no iPhone

1. Acesse Ajustes > Geral > Gerenciamento de VPN e Dispositivo
2. Encontre seu perfil de desenvolvedor
3. Toque em Confiar

---

## Resumo Rápido

| Situação | Comando |
|----------|---------|
| Código TS/JS | `npx expo run:ios --configuration Release --device` |
| Nova dependência nativa | `npx expo prebuild --clean` + run |
| Mudou app.json | `npx expo prebuild` + run |
| Limpar cache | adicione `--no-build-cache` |
| Reset total | `rm -rf ios node_modules` + install + prebuild + run |
