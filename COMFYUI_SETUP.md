# ComfyUI + OVI AI Kurulum Rehberi

## Gereksinimler
- **GPU:** 12GB+ VRAM (RTX 3060+)
- **RAM:** 32GB+
- **Disk:** 50GB+ boş alan
- **Python:** 3.10+

## 1. ComfyUI Kurulumu

```powershell
# ComfyUI indir
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Virtual environment
python -m venv venv
.\venv\Scripts\activate

# Bağımlılıklar
pip install -r requirements.txt
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
```

## 2. OVI Custom Nodes

```powershell
cd custom_nodes
git clone https://github.com/character-ai/ComfyUI-Ovi.git
cd ..
pip install -r custom_nodes/ComfyUI-Ovi/requirements.txt
```

## 3. Model İndirme (~30GB)

```powershell
# OVI model
huggingface-cli download character-ai/ovi --local-dir models/ovi

# MMAudio
huggingface-cli download hkchengrex/MMAudio --local-dir models/mmaudio

# VAE
huggingface-cli download stabilityai/sd-vae-ft-mse --local-dir models/vae
```

## 4. Başlatma

```powershell
python main.py --listen --port 8188
```

Tarayıcıda: `http://localhost:8188`

## 5. Test

OmniFlow Factory'de OVI Video template'lerinden birini seçin ve çalıştırın.
