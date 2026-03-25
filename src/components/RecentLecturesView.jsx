import React, { useState, useEffect } from 'react';
import { CalendarClock, Video, Disc, Clock } from 'lucide-react';

const RecentLecturesView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getRecentLectures().then(res => {
        const lects = res?.lectures || [];
        setData(lects);
        setLoading(false);
      });
    }
  }, []);

  const totalLectures = data.length;
  const attendedLectures = data.filter(l => l.is_attended).length;
  const attendancePercentage = totalLectures > 0 ? Math.round((attendedLectures / totalLectures) * 100) : 0;

  return (
    <div className="h-full p-6 animate-in fade-in duration-500 overflow-y-auto">
      <header className="mb-6 border-b border-white/10 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <CalendarClock className="text-amber-400" size={24} /> 
            Recent Lectures
          </h1>
          <p className="text-gray-500 text-[10px] font-mono tracking-widest mt-2 uppercase">
            Latest decoded video streams from Newton Arena.
          </p>
        </div>
        {!loading && totalLectures > 0 && (
          <div className="text-right">
             <div className={`text-3xl font-bold font-mono ${attendancePercentage >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>
                {attendancePercentage}%
             </div>
             <div className="text-[10px] uppercase font-mono tracking-widest text-gray-500">
                Attendance (Last {totalLectures})
             </div>
          </div>
        )}
      </header>

      {loading ? (
        <div className="flex gap-2 items-center text-amber-500/50">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-75"></div>
          <div className="text-xs font-mono uppercase">Fetching Records</div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-gray-500 text-sm font-mono border border-white/5 bg-white/[0.01] p-4 text-center">
            No recent lectures found in your active primary course.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((lecture, idx) => (
            <div key={lecture.id || idx} className="group p-5 bg-white/[0.01] hover:bg-black border border-white/5 shadow-sm hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(251,191,36,0.05)] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2 items-center">
                    {lecture.video_urls && lecture.video_urls.length > 0 ? (
                        <Video size={16} className="text-amber-400 group-hover:animate-pulse" />
                    ) : (
                        <Disc size={16} className="text-gray-500" />
                    )}
                    <h3 className="text-white font-medium text-sm line-clamp-1 flex-1 text-left">{lecture.title || lecture.name}</h3>
                </div>
                {lecture.is_attended ? (
                   <span className="text-[9px] uppercase font-mono tracking-widest px-2 border border-emerald-500/20 text-emerald-400 bg-emerald-500/10 shrink-0">Attended</span>
                ) : (
                   <span className="text-[9px] uppercase font-mono tracking-widest px-2 border border-red-500/20 text-red-400 bg-red-500/10 shrink-0">Missed</span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} />
                  <span>{lecture.start_time ? new Date(lecture.start_time).toLocaleDateString() : 'N/A'}</span>
                </div>
                {lecture.video_urls && lecture.video_urls.length > 0 && (
                   <a href={lecture.video_urls[0]} target="_blank" rel="noreferrer" className="text-amber-400 hover:text-amber-300 uppercase tracking-widest text-[9px] border-b border-amber-500/30">Watch Target</a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentLecturesView;
