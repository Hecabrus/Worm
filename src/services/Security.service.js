export class SecurityService {
    static init() {
        // Disable right click
        document.addEventListener('contextmenu', e => e.preventDefault());
        
        // Disable keyboard shortcuts
        document.addEventListener('keydown', e => {
            if (
                // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
                e.keyCode === 123 || 
                (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
                (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
                (e.ctrlKey && e.keyCode === 85)
            ) {
                e.preventDefault();
                return false;
            }
        });

        // Prevent drag and drop
        document.addEventListener('dragstart', e => e.preventDefault());
        document.addEventListener('drop', e => e.preventDefault());
        
        // Prevent copy/paste
        document.addEventListener('copy', e => e.preventDefault());
        document.addEventListener('paste', e => e.preventDefault());
    }
}