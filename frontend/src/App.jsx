import React, { useState } from 'react';
import { UploadCloud, Activity, User, FileText, CheckCircle, AlertTriangle, ChevronRight, Download, Users, ShieldAlert } from 'lucide-react';

const aq10Questions = [
  { id: 'A1', selfText: "1. I often notice small sounds when others do not.", otherText: "1. They often notice small sounds when others do not.", agreeScoresOne: true },
  { id: 'A2', selfText: "2. I usually concentrate more on the whole picture, rather than the small details.", otherText: "2. They usually concentrate more on the whole picture, rather than the small details.", agreeScoresOne: false },
  { id: 'A3', selfText: "3. I find it easy to do more than one thing at once.", otherText: "3. They find it easy to do more than one thing at once.", agreeScoresOne: false },
  { id: 'A4', selfText: "4. If there is an interruption, I can switch back to what I was doing very quickly.", otherText: "4. If there is an interruption, they can switch back to what they were doing very quickly.", agreeScoresOne: false },
  { id: 'A5', selfText: "5. I find it easy to 'read between the lines' when someone is talking to me.", otherText: "5. They find it easy to 'read between the lines' when someone is talking to them.", agreeScoresOne: false },
  { id: 'A6', selfText: "6. I know how to tell if someone listening to me is getting bored.", otherText: "6. They know how to tell if someone listening to them is getting bored.", agreeScoresOne: false },
  { id: 'A7', selfText: "7. When I'm reading a story I find it difficult to work out the characters' intentions.", otherText: "7. When reading a story, they find it difficult to work out the characters' intentions.", agreeScoresOne: true },
  { id: 'A8', selfText: "8. I like to collect information about categories of things (e.g. types of car, bird, etc.).", otherText: "8. They like to collect information about categories of things (e.g. types of cars, animals, etc.).", agreeScoresOne: true },
  { id: 'A9', selfText: "9. I find it easy to work out what someone is thinking or feeling just by looking at their face.", otherText: "9. They find it easy to work out what someone is thinking or feeling just by looking at their face.", agreeScoresOne: false },
  { id: 'A10', selfText: "10. I find it difficult to work out people's intentions.", otherText: "10. They find it difficult to work out people's intentions.", agreeScoresOne: true }
];

const options = ["Definitely Agree", "Slightly Agree", "Slightly Disagree", "Definitely Disagree"];

export default function App() {
  // 🟢 PERSPECTIVE TOGGLE STATE
  const [assessmentTarget, setAssessmentTarget] = useState('other'); 

  const [demographics, setDemographics] = useState({
    Age: '', Sex: 'm', Jauundice: 'no', Family_ASD: 'no'
  });
  
  const [aqResponses, setAqResponses] = useState({
    A1: '', A2: '', A3: '', A4: '', A5: '',
    A6: '', A7: '', A8: '', A9: '', A10: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const answeredQuestionsCount = Object.values(aqResponses).filter(val => val !== '').length;
  const progressPercentage = (answeredQuestionsCount / 10) * 100;

  const handleDemographicChange = (e) => {
    const { name, value } = e.target;
    setDemographics(prev => ({ ...prev, [name]: value }));
  };

  const handleAqChange = (questionId, value) => {
    setAqResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const calculateScore = (questionId, response) => {
    if (!response) return '0'; 
    const question = aq10Questions.find(q => q.id === questionId);
    const isAgree = response === "Definitely Agree" || response === "Slightly Agree";
    return question.agreeScoresOne ? (isAgree ? '1' : '0') : (isAgree ? '0' : '1');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please upload a facial image for analysis.");
      return;
    }

    setLoading(true);
    setResult(null);

    const processedAqScores = {};
    Object.keys(aqResponses).forEach(key => {
      processedAqScores[key] = calculateScore(key, aqResponses[key]);
    });

    const finalPatientData = { ...demographics, ...processedAqScores };
    const submitData = new FormData();
    submitData.append('patient_data', JSON.stringify(finalPatientData));
    submitData.append('file', imageFile);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: submitData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Backend connection failed. Ensure FastAPI is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 print:bg-white print:p-0 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden print:hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          <div className="flex items-center gap-5 z-10">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <Activity size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">NeuroVision</h1>
              <p className="text-slate-500 font-medium">Multi-Modal ASD Diagnostic Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2 z-10 px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-100 text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            System Online
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-6 print:hidden">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 space-y-8 relative overflow-hidden">
              
              <div className="flex flex-col gap-5 border-b border-slate-100 pb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <FileText className="text-indigo-500" size={24} />
                  Patient Intake
                </h2>
                
                {/* 🟢 THE PERSPECTIVE TOGGLE */}
                <div className="bg-slate-100 p-1.5 rounded-xl flex items-center w-full">
                  <button 
                    type="button" 
                    onClick={() => setAssessmentTarget('other')} 
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${assessmentTarget === 'other' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Users size={18} /> Testing Someone Else (Child/Teen)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAssessmentTarget('self')} 
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${assessmentTarget === 'self' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <User size={18} /> Testing Myself
                  </button>
                </div>
                {/* --------------------------------- */}

              </div>

              {/* Demographics Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Age', 'Sex', 'Jauundice', 'Family_ASD'].map((field) => (
                  <div key={field} className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{field.replace('_', ' ')}</label>
                    {field === 'Age' ? (
                      <input type="number" name={field} value={demographics[field]} onChange={handleDemographicChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700" placeholder="Years" />
                    ) : (
                      <select name={field} value={demographics[field]} onChange={handleDemographicChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700 appearance-none cursor-pointer">
                        {field === 'Sex' ? (<><option value="m">Male</option><option value="f">Female</option></>) : (<><option value="no">No</option><option value="yes">Yes</option></>)}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 pt-4">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
                  <span>AQ-10 Assessment</span>
                  <span className="text-indigo-600">{answeredQuestionsCount}/10 Completed</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out rounded-full" style={{ width: `${progressPercentage}%` }} />
                </div>
              </div>

              {/* Dynamic Questions Rendering */}
              <div className="space-y-6">
                {aq10Questions.map((q) => (
                  <div key={q.id} className="group">
                    {/* 🟢 QUESTIONS CHANGE DYNAMICALLY HERE BASED ON THE TOGGLE */}
                    <p className="text-[15px] font-semibold text-slate-700 mb-3 group-hover:text-slate-900 transition-colors">
                      {assessmentTarget === 'self' ? q.selfText : q.otherText}
                    </p>
                    {/* --------------------------------- */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {options.map((opt) => {
                        const isSelected = aqResponses[q.id] === opt;
                        return (
                          <button type="button" key={opt} onClick={() => handleAqChange(q.id, opt)} className={`p-3 text-xs md:text-sm font-medium rounded-xl border transition-all duration-200 transform active:scale-95 ${isSelected ? 'bg-indigo-50/80 border-indigo-500 text-indigo-700 shadow-sm shadow-indigo-100' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Image Upload */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Facial Biometrics</h3>
                <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden group ${imagePreview ? 'border-indigo-400 border-solid' : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 bg-slate-50'}`}>
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end justify-center pb-4">
                        <span className="text-white font-medium flex items-center gap-2"><UploadCloud size={18}/> Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500 group-hover:text-indigo-600 transition-colors">
                      <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <p className="mb-1 text-sm font-semibold">Click to upload scan</p>
                      <p className="text-xs opacity-70">Strictly JPG or PNG formats</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
                </label>
              </div>

              <button type="submit" disabled={loading || progressPercentage !== 100 || !imageFile} className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group">
                {loading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing Models...</>) : (<>Run Diagnostic Engine <ChevronRight className="group-hover:translate-x-1 transition-transform" /></>)}
              </button>
            </form>
          </div>

          {/* Right Column: Results - STICKY AND H-FIT */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-8 h-fit print:col-span-12 print:max-w-3xl print:mx-auto">
            
            {/* Main Result Card */}
            <div className="bg-slate-900 print:bg-white rounded-3xl shadow-xl p-8 text-white print:text-slate-900 print:border print:border-slate-300 relative overflow-hidden flex flex-col w-full">
              <div className="absolute top-0 right-0 p-32 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none print:hidden"></div>
              <div className="absolute bottom-0 left-0 p-32 bg-violet-500/20 rounded-full blur-[100px] pointer-events-none print:hidden"></div>
              
              <div className="hidden print:block mb-8 text-center border-b pb-4">
                <h1 className="text-2xl font-black text-slate-900">NeuroVision Medical Report</h1>
                <p className="text-slate-500">Official Telemetry & Screening Results</p>
              </div>

              <h3 className="text-xl font-bold mb-8 flex items-center gap-3 relative z-10 border-b border-white/10 print:border-slate-200 pb-4">
                <Activity className="text-indigo-400 print:text-indigo-600" /> Diagnostic Report
              </h3>

              {!result ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 relative z-10 min-h-[300px] print:hidden">
                  <div className="w-24 h-24 border border-dashed border-slate-700 rounded-full flex items-center justify-center mb-4 relative">
                    <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-ping"></div>
                    <User size={32} className="opacity-50" />
                  </div>
                  <p className="text-sm font-medium">Awaiting Telemetry</p>
                  <p className="text-xs text-slate-500 mt-1">Complete intake form to generate report</p>
                </div>
              ) : (
                <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  
                  {/* Final Score */}
                  <div className="text-center bg-white/5 print:bg-slate-50 p-6 rounded-2xl border border-white/10 print:border-slate-200 backdrop-blur-md">
                    <p className="text-indigo-300 print:text-indigo-600 text-xs font-bold uppercase tracking-widest mb-2">Unified Confidence Index</p>
                    <div className="text-6xl font-black text-white print:text-slate-900 tracking-tighter mb-4">
                      {result.final_confidence}%
                    </div>
                    <div className={`inline-flex px-5 py-2.5 rounded-full text-sm font-bold items-center gap-2 ${result.final_confidence >= 50 ? 'bg-rose-500/20 text-rose-300 print:text-rose-600 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 print:text-emerald-700 border border-emerald-500/30'}`}>
                      {result.final_confidence >= 50 ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                      {result.diagnosis}
                    </div>
                  </div>

                  {/* Printed Report Demographics */}
                  <div className="hidden print:grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4 text-sm">
                    <div><strong className="text-slate-500 block uppercase text-xs">Target</strong>{assessmentTarget === 'self' ? 'Self' : 'Other (Child)'}</div>
                    <div><strong className="text-slate-500 block uppercase text-xs">Age</strong>{demographics.Age} yrs</div>
                    <div><strong className="text-slate-500 block uppercase text-xs">Sex</strong>{demographics.Sex === 'm' ? 'Male' : 'Female'}</div>
                    <div><strong className="text-slate-500 block uppercase text-xs">Family Hist.</strong>{demographics.Family_ASD}</div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-5 bg-black/20 print:bg-white p-6 rounded-2xl border border-white/5 print:border-slate-200">
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-slate-300 print:text-slate-700">Behavioral (RF)</span>
                        <span className="text-white print:text-slate-900">{result.questionnaire_confidence}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-800 print:bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 print:bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] print:shadow-none" style={{ width: `${result.questionnaire_confidence}%`, transition: 'width 1s ease-out' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-slate-300 print:text-slate-700">Facial Biometrics (CNN)</span>
                        <span className="text-white print:text-slate-900">{result.image_confidence}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-800 print:bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-400 print:bg-violet-600 rounded-full shadow-[0_0_10px_rgba(167,139,250,0.5)] print:shadow-none" style={{ width: `${result.image_confidence}%`, transition: 'width 1s ease-out 0.2s' }}></div>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
            
            {/* Download Button */}
            {result && (
              <button onClick={handlePrint} className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-3 print:hidden border border-indigo-200">
                <Download size={20} />
                Download PDF Report
              </button>
            )}

            {/* Medical Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4 text-amber-800 print:hidden">
              <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5 text-amber-600" />
              <div>
                <h4 className="font-bold text-sm mb-1 text-amber-900">Predictive Screening Only</h4>
                <p className="text-xs leading-relaxed opacity-90">
                  This system utilizes machine learning algorithms to predict the likelihood of ASD traits based on behavioral patterns and facial biometrics. It is <strong>not an absolute diagnosis</strong>. Please consult a qualified medical professional or developmental pediatrician for clinical evaluation.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Project Footer (Hidden on Print) */}
        <footer className="pt-12 pb-6 border-t border-slate-200/60 mt-12 text-center text-slate-500 text-sm print:hidden">
           <p className="font-bold text-slate-700 mb-2 uppercase tracking-widest text-xs">Final Year Project</p>
           <p className="font-medium mb-1">Ayusi Dey (Roll: 11500122058) • Partner Name (Roll: XXXXXX) • Partner Name (Roll: XXXXXX) • Partner Name (Roll: XXXXXX)</p>
           <p className="opacity-80">Department of Computer Science & Engineering, 2026</p>
           <p className="opacity-80 mt-1">B.P. Poddar Institute of management and Technology</p>
        </footer>

      </div>
    </div>
  );
}