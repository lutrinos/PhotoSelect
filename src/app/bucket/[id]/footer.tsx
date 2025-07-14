import { Button } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export const Footer = ({ onPrev, onSelect, onNext, prevDisabled, selectDisabled, nextDisabled, selected }: any) => {
    return (
        <Button.Group>
            <Button disabled={prevDisabled} onClick={onPrev} variant="light">
                <IconChevronLeft />
            </Button>
            {
                !selected ? (
                    <Button disabled={selectDisabled} onClick={() => onSelect(true)}>
                        Sélectionner
                    </Button>
                ) : (
                    <Button disabled={selectDisabled} onClick={() => onSelect(false)} color="yellow">
                        Retirer
                    </Button>
                )
            }
            <Button disabled={nextDisabled} onClick={onNext} variant="light">
                <IconChevronRight />
            </Button>
        </Button.Group>
    );
};