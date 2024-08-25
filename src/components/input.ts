export const init = () => {
    const input = {
        foodButton: false,
    };

    const { body } = document;
    const foodButton = document.getElementById("foodButton") as HTMLButtonElement;

    foodButton.addEventListener("pointerdown", () => {
        input.foodButton = true;
    });

    foodButton.addEventListener("pointerup", () => {
        input.foodButton = false;
    });

    return input;
};
