// {/* <motion.div
//               key={`${image.image_path}-${index}`}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: index * 0.1 }}
//               className={`relative h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer ${selectedImage?.generatedId === image.generatedId
//                 ? "border-2 border-sky-500"
//                 : ""
//                 }`}
//               onClick={() => handleImageClick(image)}
//             >
//               <Image
//                 src={image.image_path}
//                 alt={`Image ${index + 1}`}
//                 fill
//                 priority
//                 className="transition-transform duration-300 hover:scale-105 object-contain"
//               />
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 whileHover={{
//                   backgroundColor: "rgba(0, 0, 0, 0.3)",
//                   opacity: 1,
//                 }}
//                 transition={{ duration: 0.3 }}
//                 className="absolute md:flex hidden top-0 left-0 w-full h-full bg-black justify-center items-center gap-8"
//               >
//                 {image.childid === getID && (
//                   <>
//                     <motion.button
//                       initial={{ backgroundColor: "#FFD094", color: "#403737" }}
//                       whileHover={{
//                         scale: 1.1,
//                         backgroundColor: "#403737",
//                         color: "white",
//                       }}
//                       whileTap={{ scale: 0.9 }}
//                       transition={{ duration: 0.3, delay: 0.2 }}
//                       className="w-32 py-2 rounded-full"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedImage(image);
//                         setEditModalOpen(true);
//                       }}
//                     >
//                       Edit
//                     </motion.button>
//                     <motion.button
//                       initial={{ backgroundColor: "#FFD094", color: "#403737" }}
//                       whileHover={{
//                         scale: 1.1,
//                         backgroundColor: "#403737",
//                         color: "white",
//                       }}
//                       whileTap={{ scale: 0.9 }}
//                       transition={{ duration: 0.3, delay: 0.2 }}
//                       className="w-32 py-2 rounded-full"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setImageToDelete({
//                           generatedId: image.generatedId,
//                           image_path: image.image_path,
//                         });
//                         setDeleteModalOpen(true);
//                       }}
//                     >
//                       Delete
//                     </motion.button>
//                   </>
//                 )}

//                 {image.childid != getID && (
//                   <>
//                     <motion.button
//                       initial={{ backgroundColor: "#FFD094", color: "#403737" }}
//                       whileHover={{
//                         scale: 1.1,
//                         backgroundColor: "#403737",
//                         color: "white",
//                       }}
//                       whileTap={{ scale: 0.9 }}
//                       transition={{ duration: 0.3, delay: 0.2 }}
//                       className="w-32 py-2 rounded-full"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedImage(image);
//                         setInterestModalOpen(true);
//                         setChat(false);
//                       }}
//                     >
//                       Interested?
//                     </motion.button>
//                   </>
//                 )}
//               </motion.div>
//             </motion.div> */}