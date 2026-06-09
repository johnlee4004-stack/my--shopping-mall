'use client';

import { useState, useRef } from 'react';
import { Send, Upload, CheckCircle, X, Camera } from 'lucide-react';

type FormState = 'idle' | 'submitting' | 'success';

const serviceOptions = [
  '누수·방수', '전기·조명', '설비·배관', '문·창호', '도배·마루', '인테리어 리모델링', '기타',
];

export default function QuoteForm() {
  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [date, setDate]           = useState('');
  const [service, setService]     = useState('');
  const [detail, setDetail]       = useState('');
  const [files, setFiles]         = useState<File[]>([]);
  const [dragging, setDragging]   = useState(false);
  const [formState, setFormState] = useState<FormState>('idle');
  const fileRef = useRef<HTMLInputElement>(null);

  const formatPhone = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...valid].slice(0, 5));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !service) return;
    setFormState('submitting');
    await new Promise(r => setTimeout(r, 1200));
    setFormState('success');
  };

  if (formState === 'success') {
    return (
      <section id="quote-form" className="py-20 bg-orange-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">견적 문의 완료!</h3>
            <p className="text-gray-500 text-lg mb-2">
              <strong className="text-gray-800">{name}</strong>님, 접수가 완료되었습니다.
            </p>
            <p className="text-gray-500 mb-8">
              <strong className="text-orange-500">1시간 이내</strong>에 전문 상담원이 <strong>{phone}</strong>으로 연락드립니다.
            </p>
            <a
              href="https://open.kakao.com/o/doxhayx"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-2xl transition-colors"
            >
              카카오톡으로도 확인하기
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote-form" className="py-20 bg-orange-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-orange-500 font-bold text-sm tracking-widest uppercase">Free Estimate</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-3">
            무료 견적 문의
          </h2>
          <p className="text-gray-500">회원가입 없이 간단하게 — 1시간 내 전문가가 연락드립니다</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          {/* 이름 + 연락처 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">성함 *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="홍길동"
                required
                className="w-full border-2 border-gray-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">연락처 *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                placeholder="010-0000-0000"
                required
                className="w-full border-2 border-gray-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* 서비스 선택 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">수리 분야 *</label>
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setService(opt)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                    service === opt
                      ? 'border-orange-500 bg-orange-500 text-white shadow-sm'
                      : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-orange-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 희망 날짜 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">수리 희망 날짜</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border-2 border-gray-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>

          {/* 사진 첨부 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              문제 사진 첨부 <span className="text-gray-400 font-normal">(최대 5장, 정확한 견적에 도움됩니다)</span>
            </label>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                dragging ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
              }`}
            >
              <Camera size={28} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">사진을 여기로 드래그하거나 클릭해서 선택</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, HEIC 지원</p>
              <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={e => addFiles(e.target.files)} />
            </div>
            {files.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {files.map((f, i) => (
                  <div key={i} className="relative group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                      <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFiles(p => p.filter((_, j) => j !== i))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 상세 내용 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">상세 내용</label>
            <textarea
              value={detail}
              onChange={e => setDetail(e.target.value)}
              placeholder="어디서 어떤 문제가 발생했는지 간단히 적어주세요. (예: 화장실 세면대 아래 물이 새고 있어요)"
              rows={4}
              className="w-full border-2 border-gray-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={formState === 'submitting'}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-60 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-orange-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {formState === 'submitting' ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                접수 중...
              </>
            ) : (
              <>
                <Send size={18} />
                무료 견적 문의하기
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            개인정보는 견적 상담 외 다른 목적으로 사용되지 않습니다.
          </p>
        </form>
      </div>
    </section>
  );
}
