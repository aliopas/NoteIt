function NoteList(props) {
    return (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {props.recentNotes && props.recentNotes.length > 0 ? (
        props.recentNotes.map((note) => (   
          <div key={note.id} className="flex flex-col gap-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-4 h-full">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA--RIk2K2VpdQMfgr1vMndPreWw1sA259YTeWi6MYPtAtcx2ypLbWnVKGEulRWMse5xtQ0CSOUyDq-mPKl66NTMIxVt6KiUV3zbVT7-zRh5QBSgUPeTB5aTQG22ZWiaTMFhM1Z4QRJ8Q_NWUq3DGmWW_Xrd4JhBMQC-NS1XVeo8cjYFuqJyyI1UyrWtzrd-f4nnGUalEDckEavAnjybIeav5cEWnDU-KlZMoT6Lqll-m-hGJUcGsioXmWFy4ePNcBjb73LIRftRg")',
              }}
            ></div>
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-base font-bold leading-tight text-stone-900 dark:text-white">
                {note.title}
              </p>
              <p className="text-sm font-normal leading-normal text-stone-600 dark:text-stone-400 line-clamp-2">
                {note.content.length > 30
                ? note.content.substring(0, 30) + "..." 
                : note.content}
              </p>
            </div>
            <div className="flex justify-start mt-auto">
              <button
              onClick={() => props.onViewNote(note)}
              className="flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary/20 dark:bg-primary/30 text-sm font-medium leading-normal text-primary hover:bg-primary/30 dark:hover:bg-primary/40">
                <span>View</span>
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-stone-600 dark:text-stone-400 col-span-full text-center">
          No notes yet. Create your first note!
        </p>
      )}
    </div>
    );
}

export default NoteList;