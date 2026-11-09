export function cloudImage(url,width=800){if(!url?.includes('/upload/'))return url;return url.replace('/upload/',`/upload/f_auto,q_auto,w_${width}/`)}
export function cloudSrcSet(url){return url?.includes('/upload/')?[400,800,1200,1600].map(w=>`${cloudImage(url,w)} ${w}w`).join(', '):undefined}
export function cloudPlaceholder(url){return url?.includes('/upload/')?url.replace('/upload/','/upload/f_auto,q_auto,w_40,e_blur:600/'):url}
