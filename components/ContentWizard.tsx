// ============================================
// CONTENT WIZARD - 4 ADIMLI İÇERİK ÜRETIM SIHIRBAZI
// Boşluk Analizi → Psikografik → Amigdala → Semantik
// Auto-Mode: Template'den otomatik cevap üretir
// ============================================

import React, { useState, useEffect } from 'react';
import { STEP_QUESTIONS, SCORE_THRESHOLDS, runFullContentAnalysis, ContentAnalysisResult } from '../services/contentStandardsService';

interface ContentWizardProps {
    templateName: string;
    templateCategory: string;
    onComplete: (analysisResult: ContentAnalysisResult, answers: Record<string, string>) => void;
    onCancel: () => void;
    // Auto-mode: Otomatik üretilmiş cevaplarla başla
    autoAnswers?: Record<string, string>;
}

export const ContentWizard: React.FC<ContentWizardProps> = ({
    templateName,
    templateCategory,
    onComplete,
    onCancel,
    autoAnswers
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [answers, setAnswers] = useState<Record<string, string>>(autoAnswers || {});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<ContentAnalysisResult | null>(null);

    const steps = [
        STEP_QUESTIONS.step1_gapAnalysis,
        STEP_QUESTIONS.step2_psychographics,
        STEP_QUESTIONS.step3_amygdalaTriggers,
        STEP_QUESTIONS.step4_semanticScore
    ];

    // Auto-mode: Eğer autoAnswers varsa direkt analiz yap
    useEffect(() => {
        if (autoAnswers && Object.keys(autoAnswers).length > 0 && !analysisResult && !isAnalyzing) {
            console.log('🤖 Auto-mode aktif, analiz başlatılıyor...');
            runAutoAnalysis();
        }
    }, [autoAnswers]);

    const runAutoAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            const brief = {
                topic: autoAnswers?.topic || templateName,
                targetAudience: autoAnswers?.targetAudience || 'Genel hedef kitle',
                platform: (autoAnswers?.platform as any) || 'instagram',
                contentType: (autoAnswers?.contentType as any) || 'post',
                goal: (autoAnswers?.goal as any) || 'conversion'
            };

            const result = await runFullContentAnalysis(brief, autoAnswers?.draftContent);
            setAnalysisResult(result);
            console.log('✅ Otomatik analiz tamamlandı:', result.finalScore);

            // Auto-mode'da analiz tamamlandığında otomatik devam et
            // Puan 70+ ise direkt onComplete çağır, değilse sonuç ekranını göster
            if (result.approved && autoAnswers) {
                console.log('🚀 Auto-mode: Puan yeterli, şablon yükleniyor...');
                onComplete(result, autoAnswers);
            }
        } catch (error) {
            console.error('Analiz hatası:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const currentStepData = steps[currentStep - 1];

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const canProceed = () => {
        const requiredQuestions = currentStepData.questions.filter(q => q.required);
        return requiredQuestions.every(q => answers[q.id]?.trim());
    };

    const handleNext = async () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            // Son adım - analiz yap
            setIsAnalyzing(true);
            try {
                const result = await runFullContentAnalysis({
                    topic: answers.topic || '',
                    targetAudience: answers.targetAudience || '',
                    platform: (answers.platform?.toLowerCase() || 'instagram') as any,
                    contentType: 'post',
                    goal: 'engagement'
                }, answers.draftContent);

                setAnalysisResult(result);
            } catch (error) {
                console.error('Analiz hatası:', error);
            }
            setIsAnalyzing(false);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= SCORE_THRESHOLDS.viral) return 'text-purple-400';
        if (score >= SCORE_THRESHOLDS.optimal) return 'text-emerald-400';
        if (score >= SCORE_THRESHOLDS.acceptable) return 'text-yellow-400';
        if (score >= SCORE_THRESHOLDS.minimum) return 'text-orange-400';
        return 'text-rose-400';
    };

    const getScoreEmoji = (score: number) => {
        if (score >= SCORE_THRESHOLDS.viral) return '🚀';
        if (score >= SCORE_THRESHOLDS.optimal) return '✅';
        if (score >= SCORE_THRESHOLDS.acceptable) return '🔄';
        if (score >= SCORE_THRESHOLDS.minimum) return '⚠️';
        return '❌';
    };

    // Sonuç ekranı
    if (analysisResult) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-slate-700">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            {getScoreEmoji(analysisResult.finalScore)}
                            İçerik Analiz Sonucu
                        </h2>
                        <p className="text-slate-400 mt-1">{templateName}</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Final Skor */}
                        <div className="text-center p-6 bg-slate-800 rounded-xl">
                            <div className={`text-6xl font-bold ${getScoreColor(analysisResult.finalScore)}`}>
                                {analysisResult.finalScore}
                            </div>
                            <div className="text-slate-400 mt-2">
                                {analysisResult.approved ? '✅ Yayına Hazır' : '⚠️ Düzenleme Gerekli'}
                            </div>
                        </div>

                        {/* Adım Skorları */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                                <div className="text-sm text-slate-400">🔍 Boşluk Analizi</div>
                                <div className={`text-2xl font-bold ${getScoreColor(analysisResult.step1_gapAnalysis.score)}`}>
                                    {analysisResult.step1_gapAnalysis.score}
                                </div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                                <div className="text-sm text-slate-400">📊 Psikografik</div>
                                <div className={`text-2xl font-bold ${getScoreColor(analysisResult.step2_psychographics.score)}`}>
                                    {analysisResult.step2_psychographics.score}
                                </div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                                <div className="text-sm text-slate-400">🧠 Amigdala</div>
                                <div className={`text-2xl font-bold ${getScoreColor(analysisResult.step3_amygdalaTriggers.score)}`}>
                                    {analysisResult.step3_amygdalaTriggers.score}
                                </div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                                <div className="text-sm text-slate-400">⚖️ Semantik</div>
                                <div className={`text-2xl font-bold ${getScoreColor(analysisResult.step4_semanticScore.overallScore)}`}>
                                    {analysisResult.step4_semanticScore.overallScore}
                                </div>
                            </div>
                        </div>

                        {/* Öneriler */}
                        {analysisResult.recommendations.length > 0 && (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                <h3 className="font-semibold text-amber-400 mb-2">📝 Öneriler</h3>
                                <ul className="space-y-1">
                                    {analysisResult.recommendations.map((rec, idx) => (
                                        <li key={idx} className="text-slate-300 text-sm">{rec}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Hook Önerileri */}
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                            <h3 className="font-semibold text-emerald-400 mb-2">🎣 Önerilen Hook'lar</h3>
                            <ul className="space-y-2">
                                {analysisResult.step3_amygdalaTriggers.emotionalHooks.slice(0, 3).map((hook, idx) => (
                                    <li key={idx} className="text-slate-300 text-sm bg-slate-800 p-2 rounded">
                                        {hook}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-700 flex gap-3">
                        <button
                            onClick={() => setAnalysisResult(null)}
                            className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                            ← Düzenle
                        </button>
                        <button
                            onClick={() => onComplete(analysisResult, answers)}
                            disabled={!analysisResult.approved}
                            className={`flex-1 py-3 px-4 rounded-lg transition-colors ${analysisResult.approved
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            {analysisResult.approved ? 'İçerik Üret →' : 'Skor Yetersiz'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Soru formu
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">{templateName}</h2>
                        <button onClick={onCancel} className="text-slate-400 hover:text-white">✕</button>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map((step) => (
                            <React.Fragment key={step}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === currentStep
                                    ? 'bg-blue-600 text-white'
                                    : step < currentStep
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-700 text-slate-400'
                                    }`}>
                                    {step < currentStep ? '✓' : step}
                                </div>
                                {step < 4 && (
                                    <div className={`flex-1 h-1 ${step < currentStep ? 'bg-emerald-600' : 'bg-slate-700'
                                        }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white">{currentStepData.title}</h3>
                        <p className="text-slate-400 text-sm">{currentStepData.description}</p>
                    </div>

                    <div className="space-y-4">
                        {currentStepData.questions.map((question) => (
                            <div key={question.id}>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    {question.question}
                                    {question.required && <span className="text-rose-400 ml-1">*</span>}
                                </label>

                                {question.type === 'text' && (
                                    <input
                                        type="text"
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        placeholder={question.placeholder}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                                    />
                                )}

                                {question.type === 'textarea' && (
                                    <textarea
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        placeholder={question.placeholder}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                                    />
                                )}

                                {question.type === 'select' && 'options' in question && (
                                    <select
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="">Seçin...</option>
                                        {question.options?.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700 flex gap-3">
                    <button
                        onClick={currentStep === 1 ? onCancel : handleBack}
                        className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                        {currentStep === 1 ? 'İptal' : '← Geri'}
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!canProceed() || isAnalyzing}
                        className={`flex-1 py-3 px-4 rounded-lg transition-colors ${canProceed() && !isAnalyzing
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {isAnalyzing ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin">⏳</span> Analiz Ediliyor...
                            </span>
                        ) : currentStep === 4 ? (
                            '📊 Analiz Et'
                        ) : (
                            'Devam →'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContentWizard;
