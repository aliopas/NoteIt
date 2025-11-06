import React from "react";
function AddingCategory(props){
    return(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="mx-auto max-w-md w-full px-4 sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-background-dark rounded-xl shadow-lg dark:shadow-2xl overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Category</h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter a name for your new category.</p>
                            </div>
                            <div className="px-6 pb-6">
                                <label className="sr-only" htmlFor="category-name">Category Name</label>
                                <input 
                                    className="p-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shadow-sm focus:border-primary focus:ring-primary text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                                    id="category-name" 
                                    placeholder="Category Name" 
                                    type="text"
                                    value={props.categoryName}
                                    onChange={(e) => props.setCategoryName(e.target.value)}
                                />
                            </div>
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end items-center gap-4">
                                <button 
                                    onClick={() => {
                                        props.setIsModalOpen(false);
                                        props.setCategoryName('');
                                    }}
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={()=>{props.handleSaveCategory()}}
                                    className="inline-flex justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
    )
}
export default AddingCategory;