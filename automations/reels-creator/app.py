import gradio as gr
import os
import json
from reels_bot import run_workflow

def generate_reel(topic):
    try:
        results = run_workflow(topic)
        # Format results for display
        output_text = ""
        for step, content in results.items():
            output_text += f"## {step}\n{content}\n\n"
        return output_text
    except Exception as e:
        return f"Error: {e}"

iface = gr.Interface(
    fn=generate_reel,
    inputs=gr.Textbox(label="Video Konusu (Örn: Sarı Saç Bakımı)", value="Kuafor Salonu Trendleri"),
    outputs=gr.Markdown(label="Oluşturulan İçerik Planı"),
    title="💇‍♀️ Kuaför Reels Asistanı",
    description="HuggingFace AI kullanarak kuaförler için otomatik Reels senaryosu ve planı oluşturun.",
    concurrency_limit=2
)

if __name__ == "__main__":
    iface.launch()
