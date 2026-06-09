import { motion } from "framer-motion";

interface BasicsStepProps {
  basics: {
    guests: number;
    bedrooms: number;
    beds: number;
    hasLock: boolean | null;
  };
  setBasics: (basics: any) => void;
  studentHousing: {
    forStudents: boolean;
    needsRoommate: boolean;
    roommateSlots: number;
  };
  setStudentHousing: (studentHousing: any) => void;
}

export const BasicsStep = ({ basics, setBasics, studentHousing, setStudentHousing }: BasicsStepProps) => {

  return (
    <motion.div
      key="basics"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center px-6 py-8 md:p-10 overflow-y-auto"
    >
      <div className="max-w-2xl w-full">
<h1 className="text-[26px] md:text-4xl font-display font-[600] text-slate-900 leading-tight mb-12">
          Let's start with the basics
        </h1>
        
        <div className="space-y-8">
          <div className="flex items-center justify-between pb-8 border-b border-slate-100">
            <span className="text-xl font-medium text-slate-700">Guests</span>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setBasics({...basics, guests: Math.max(1, basics.guests - 1)})}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
              >
                <i className="ph-bold ph-minus text-sm"></i>
              </button>
              <span className="w-8 text-center font-bold text-slate-900 text-xl">{basics.guests}</span>
              <button 
                onClick={() => setBasics({...basics, guests: basics.guests + 1})}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
              >
                <i className="ph-bold ph-plus text-sm"></i>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between pb-8 border-b border-slate-100">
            <span className="text-xl font-medium text-slate-700">Bedrooms</span>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setBasics({...basics, bedrooms: Math.max(0, basics.bedrooms - 1)})}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
              >
                <i className="ph-bold ph-minus text-sm"></i>
              </button>
              <span className="w-8 text-center font-bold text-slate-900 text-xl">{basics.bedrooms}</span>
              <button 
                onClick={() => setBasics({...basics, bedrooms: basics.bedrooms + 1})}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
              >
                <i className="ph-bold ph-plus text-sm"></i>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between pb-8 border-b border-slate-100">
            <span className="text-xl font-medium text-slate-700">Beds</span>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setBasics({...basics, beds: Math.max(1, basics.beds - 1)})}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
              >
                <i className="ph-bold ph-minus text-sm"></i>
              </button>
              <span className="w-8 text-center font-bold text-slate-900 text-xl">{basics.beds}</span>
              <button 
                onClick={() => setBasics({...basics, beds: basics.beds + 1})}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
              >
                <i className="ph-bold ph-plus text-sm"></i>
              </button>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Does every bedroom have a lock?</h3>
            <div className="space-y-4">
              <button 
                onClick={() => setBasics({...basics, hasLock: true})}
                className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                  basics.hasLock === true ? "border-slate-900 bg-white ring-1 ring-slate-900" : "border-slate-100 hover:border-slate-300"
                }`}
              >
                <span className="font-bold text-slate-700 text-lg">Yes</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${basics.hasLock === true ? "border-slate-900 bg-slate-900" : "border-slate-200"}`}>
                  {basics.hasLock === true && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
              </button>
              <button 
                onClick={() => setBasics({...basics, hasLock: false})}
                className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                  basics.hasLock === false ? "border-slate-900 bg-white ring-1 ring-slate-900" : "border-slate-100 hover:border-slate-300"
                }`}
              >
                <span className="font-bold text-slate-700 text-lg">No</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${basics.hasLock === false ? "border-slate-900 bg-slate-900" : "border-slate-200"}`}>
                  {basics.hasLock === false && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-brand-100 bg-brand-50/40 p-6 md:p-7">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Student and roommate setup</h3>
              <p className="text-sm md:text-base text-slate-500">
                Mark this listing if it suits students or if you want it to appear on the roommates dashboard.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <button
                onClick={() => setStudentHousing({ ...studentHousing, forStudents: !studentHousing.forStudents })}
                className={`w-full flex items-start justify-between gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
                  studentHousing.forStudents ? "border-brand-500 bg-white shadow-sm" : "border-white/80 bg-white/80 hover:border-brand-200"
                }`}
              >
                <div>
                  <p className="text-lg font-bold text-slate-900">Good for students</p>
                  <p className="mt-1 text-sm text-slate-500">Shows this home as student-friendly across listing surfaces.</p>
                </div>
                <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${studentHousing.forStudents ? "border-brand-500 bg-brand-500" : "border-slate-200"}`}>
                  {studentHousing.forStudents && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
              </button>

              <button
                onClick={() =>
                  setStudentHousing({
                    ...studentHousing,
                    needsRoommate: !studentHousing.needsRoommate,
                    roommateSlots: studentHousing.roommateSlots || 1,
                  })
                }
                className={`w-full flex items-start justify-between gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
                  studentHousing.needsRoommate ? "border-brand-500 bg-white shadow-sm" : "border-white/80 bg-white/80 hover:border-brand-200"
                }`}
              >
                <div>
                  <p className="text-lg font-bold text-slate-900">Needs roommate to share</p>
                  <p className="mt-1 text-sm text-slate-500">Triggers this home on the roommates dashboard for students and shared-living seekers.</p>
                  <p className="mt-2 text-xs font-semibold text-brand-700">Perfect for students looking for roommates.</p>
                </div>
                <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${studentHousing.needsRoommate ? "border-brand-500 bg-brand-500" : "border-slate-200"}`}>
                  {studentHousing.needsRoommate && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
              </button>

              {studentHousing.needsRoommate && (
                <div className="rounded-2xl bg-white p-5 border border-brand-100">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-base font-bold text-slate-900">Roommate spaces</p>
                      <p className="text-sm text-slate-500">How many roommate spots are you opening?</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          setStudentHousing({
                            ...studentHousing,
                            roommateSlots: Math.max(1, studentHousing.roommateSlots - 1),
                          })
                        }
                        className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-brand-500 hover:text-brand-600 transition-all"
                      >
                        <i className="ph-bold ph-minus text-sm"></i>
                      </button>
                      <span className="w-8 text-center text-xl font-bold text-slate-900">{studentHousing.roommateSlots}</span>
                      <button
                        onClick={() =>
                          setStudentHousing({
                            ...studentHousing,
                            roommateSlots: studentHousing.roommateSlots + 1,
                          })
                        }
                        className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-brand-500 hover:text-brand-600 transition-all"
                      >
                        <i className="ph-bold ph-plus text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

