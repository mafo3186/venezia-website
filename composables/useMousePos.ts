export const useMousePos = () => {
    const mousePos = useState('mousePos', () => ref({x: 0, y: 0}));


    return {
        mousePos
    }
}
