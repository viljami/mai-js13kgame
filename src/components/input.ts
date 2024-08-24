export const init = () => {
    const input = {
        foodButton: false,
    };

    const foodButton = document.getElementById("foodButton") as HTMLButtonElement;

    foodButton.addEventListener("pointerdown", () => () => {
        console.log("down")
        input.foodButton = true;
    });

    foodButton.addEventListener("pointerup", () => () => {
        input.foodButton = false;
    });

    return input;
};
